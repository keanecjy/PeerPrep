# AWS Deployment
The various configs and kubernetes config is found in this folder

## Contents
- [AWS Deployment](#aws-deployment)
  - [Contents](#contents)
  - [Requirements](#requirements)
  - [Getting Started](#getting-started)
    - [Step 1: Creating ECR images](#step-1-creating-ecr-images)
    - [Step 2: Creating the EKS Cluster](#step-2-creating-the-eks-cluster)
    - [Step 3: Creating the namespace](#step-3-creating-the-namespace)
    - [Step 4: Creating the cluster autoscaler resource](#step-4-creating-the-cluster-autoscaler-resource)
      - [Create the autoscaler IAM Role](#create-the-autoscaler-iam-role)
      - [Adding the Node group tags](#adding-the-node-group-tags)
      - [Starting the autoscaler](#starting-the-autoscaler)
    - [Step 5: Creating the main services](#step-5-creating-the-main-services)
    - [Step 6: Creating the ALB-Ingress resource](#step-6-creating-the-alb-ingress-resource)
      - [Create the ALB controller IAM Role](#create-the-alb-controller-iam-role)
    - [Step 7: Creating the Horizontal Pod Autoscaler](#step-7-creating-the-horizontal-pod-autoscaler)
    - [Step 8: Setup the public connection](#step-8-setup-the-public-connection)
  - [Resources](#resources)

## Requirements
Before starting the deployment, you must install and configure the following tools to create and manage an Amazon EKS cluster.

* **`kubectl`** – A command line tool for working with Kubernetes clusters. [Guide](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)

* **`aws`** – A command line tool for managing your AWS services

* **`eksctl`** – A command line tool for working with EKS clusters that automates many individual tasks. [Guide](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html)

* **Required IAM permissions** – The IAM security principal that you're using must have permissions to work with Amazon EKS IAM roles and service linked roles, AWS CloudFormation, and a VPC and related resources. This account is used by `eksctl` to communicate with AWS resources. [Guide](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html)
  * Hint: You can create an IAM user with `AdministratorAccess` policy (This IAM user should only be used by you)



## Getting Started

### Step 1: Creating ECR images
1. Using the AWS console, create 4 ECR repositories corresponding to push each individual backend services

2. Login to AWS CLI, build, tag and push the image onto the respective ECR repository

3. *Remember to update the ECR image url throughout the repo*


### Step 2: Creating the EKS Cluster
The definition for cluster creation is provided in `eksctl/cluster.yml`

1. The `eksctl` create cluster command will build the EKS cluster according to the definitions and add all the required resources (VPC, nodegroup, Cloudfront etc)

    ``` bash
    eksctl create cluster -f cluster.yaml
    ```
2. After your cluster is created, you can connect to your cluster using the following command
    ``` bash
    aws eks --region ap-southeast-1 update-kubeconfig --name peerprep-cluster
    ```

### Step 3: Creating the namespace
1. Creates the PeerPrep namespace
    ``` bash
    kubectl apply -f 00-namespace
    ```

### Step 4: Creating the cluster autoscaler resource
Guide for this section: [Link](https://computingforgeeks.com/enable-cluster-autoscaler-in-an-eks-cluster/)
#### Create the autoscaler IAM Role
1. If you have not created an OIDC identity provider for your EKS cluster. Proceed to do so using `eksctl` tool
    ```bash
    # Determine if you have an existing IAM OIDC provider for your cluster.
    aws eks describe-cluster --name peerprep-cluster --query "cluster.identity.oidc.issuer" --output text

    # Associate OIDC provider to your cluster
    eksctl utils associate-iam-oidc-provider --cluster peerprep-cluster --approve
    ```
2. From the IAM console, attach the identity provider a new IAM role.
3. Update the following section of the trust relationship for that autoscaler IAM role
    ``` json
    "StringEquals": {
      "<OIDC arn>:sub": "system:serviceaccount:kube-system:cluster-autoscaler"
    }
    ```
4. Create a new policy (defined in `policies/autoscaler-iam-policy.json`) and attach it to the autoscaler IAM role
5. Update the `eks.amazonaws.com/role-arn` in `01-rbac-cluster-autoscaler.yml` with the new role arn

#### Adding the Node group tags
1. To let the Cluster autoscaler auto-discover the cluster nodes. You have to add the following tags to the Auto Scaling Group
    | Key                                      	  | Value 	|
    |-------------------------------------------- |-------	|
    | k8s.io/cluster-autoscaler/peerprep-cluster  | owned 	|
    | k8s.io/cluster-autoscaler/enabled        	  | true  	|

2. Update the tags in the `02-cluster-autoscaler.yml` deployment definition as required


#### Starting the autoscaler
1. Creates the autoscaler deployment in kubernetes
   ``` bash
   kubectl apply -f 01-cluster-autoscaler
   ```

2. Check that the cluster is running
   ``` bash
   kubectl -n kube-system logs -f deployment.apps/cluster-autoscaler
   ```



### Step 5: Creating the main services
1. Rename `01-env-secret.sample.yaml` to `01-env-secret.yaml`
2. Update the environment variables in the file. Theses are environment variables shared among all 4 services
3. Create the resources for our backend microservices (deployment and service)
    ``` bash
    kubectl apply -f 02-manifest
    ```
4. Check that all services are up and running. View logs to see any error during deployment

### Step 6: Creating the ALB-Ingress resource
Guide for this section: [link](https://medium.com/cloudzone/aws-alb-ingress-controller-guide-ec16233f5903)

#### Create the ALB controller IAM Role
1. The role creation is similar to the cluster autoscaler workflow. First, create a new role and attach the OIDC provider for your cluster
2. Update the trust relationship
   ``` json
   "StringEquals": {
      "<OIDC arn>:sub": "system:serviceaccount:kube-system:alb-ingress-controller"
    }
    ```
3. Attach a new policy to the role. Policy definition is provided in `policies/alb-iam-policy.json`
4. Update the `eks.amazonaws.com/role-arn` in `02-rbac-role-alb-ingress-controller.yml` with the new role arn

#### Checking the VPC and subnet tag
1. Update the vpc in `02-rbac-role-alb-ingress-controller.yml` to the corresponding cluster's VPC
2. Ensure that the VPC subnet is tagged accordingly (dependign on subnet type) so that Kubernetes can discover them

    *These should already be set by `eksctl`*
    | Key                                      	  | Value 	| Subnet Type |
    |-------------------------------------------- |:------- |:-----------:|
    | k8s.io/cluster/peerprep-cluster             | shared 	| all         |
    | k8s.io/role/elb                         	  | 1  	    | Public only |
    | k8s.io/role/internal-elb                    | 1  	    | Private only|


#### Create the ALB and Ingress resources
1. Note: Update the SSL certificate as required. If required, request a new certificate from AWS ACM.

2. Creates the ALB and Ingress resources
   ``` bash
   kubectl apply -f 03-ingress
   ```

3. Check that the `alb-ingress-controller` is running
   ``` bash
   kubectl get pods -n kube-system
   ```

### Step 7: Creating the Horizontal Pod Autoscaler
1. Creates the metrics-server and hpa for each deployment
   ``` bash
   kubectl apply -f 04-hpa
   ```


### Step 8: Setup the public connection
1. Use Route53 to create a routing from your domain to the ALB service




## Resources
* [eksctl and eks guide](https://towardsdatascience.com/kubernetes-application-deployment-with-aws-eks-and-ecr-4600e11b2d3c)
* [Cluster autoscaler guide](https://computingforgeeks.com/enable-cluster-autoscaler-in-an-eks-cluster/)
* [eksctl guide](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html)
* [ALB Ingress guide](https://medium.com/cloudzone/aws-alb-ingress-controller-guide-ec16233f5903)