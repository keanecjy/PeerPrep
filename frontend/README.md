<p align="center">
  <img src="public/peerprep.svg" width="320" alt="PeerPrep Logo" />
</p>
<h1 align="center">PeerPrep Frontend</h1>
<p align="center">PeerPrep is a collaborative coding platform for you to practise coding interviews. <br/>Match with a partner and start coding with them now!</p>

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Local deployment
The frontend client is located at localhost:3000

If you are running backend locally, a seeded user account is provided:
```json
email: seeder@email.com
password: password
```

Otherwise, you can choose to login as guest or create a new account (requires a valid email)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn prettier` / `yarn lint`

Prettify all files in the src folder


### `yarn deploy`

Consists of 3 phases for a successful AWS deployment:

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

Push any changes in `build` folder with AWS `s3://peerprep` bucket.

Invalidate cloudfront cache so that end-users are loading the latest content


### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Technology
* Built using ReactJS
* Axios as HTTP client
* Socket.io for live functionality through socket connection
* Formik and Yup for form managment and validation
* React Toastify as notification manager
* Codemirror for live collab coding editor
## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
