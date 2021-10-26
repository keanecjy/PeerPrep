const EASY_1 = {
  titleSlug: 'most-common-word',
  title: 'Most Common Word',
  questionId: '837',
  content:
    '<p>Given a string <code>paragraph</code> and a string array of the banned words <code>banned</code>, return <em>the most frequent word that is not banned</em>. It is <strong>guaranteed</strong> there is <strong>at least one word</strong> that is not banned, and that the answer is <strong>unique</strong>.</p>\n\n<p>The words in <code>paragraph</code> are <strong>case-insensitive</strong> and the answer should be returned in <strong>lowercase</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong>Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> paragraph = &quot;Bob hit a ball, the hit BALL flew far after it was hit.&quot;, banned = [&quot;hit&quot;]\n<strong>Output:</strong> &quot;ball&quot;\n<strong>Explanation:</strong> \n&quot;hit&quot; occurs 3 times, but it is a banned word.\n&quot;ball&quot; occurs twice (and no other word does), so it is the most frequent non-banned word in the paragraph. \nNote that words in the paragraph are not case sensitive,\nthat punctuation is ignored (even if adjacent to words, such as &quot;ball,&quot;), \nand that &quot;hit&quot; isn&#39;t the answer even though it occurs more because it is banned.\n</pre>\n\n<p><strong>Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> paragraph = &quot;a.&quot;, banned = []\n<strong>Output:</strong> &quot;a&quot;\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= paragraph.length &lt;= 1000</code></li>\n\t<li>paragraph consists of English letters, space <code>&#39; &#39;</code>, or one of the symbols: <code>&quot;!?&#39;,;.&quot;</code>.</li>\n\t<li><code>0 &lt;= banned.length &lt;= 100</code></li>\n\t<li><code>1 &lt;= banned[i].length &lt;= 10</code></li>\n\t<li><code>banned[i]</code> consists of only lowercase English letters.</li>\n</ul>\n',
  difficulty: 'Easy',
  topics: ['Hash Table', 'String'],
  code: [
    {
      lang: 'Java',
      langSlug: 'java',
      code: 'class Solution {\n    public String mostCommonWord(String paragraph, String[] banned) {\n        \n    }\n}',
    },
    {
      lang: 'Python',
      langSlug: 'python',
      code: 'class Solution(object):\n    def mostCommonWord(self, paragraph, banned):\n        """\n        :type paragraph: str\n        :type banned: List[str]\n        :rtype: str\n        """\n        ',
    },
    {
      lang: 'JavaScript',
      langSlug: 'javascript',
      code: '/**\n * @param {string} paragraph\n * @param {string[]} banned\n * @return {string}\n */\nvar mostCommonWord = function(paragraph, banned) {\n    \n};',
    },
  ],
  hints: [],
  exampleTestcases:
    '"Bob hit a ball, the hit BALL flew far after it was hit."\n["hit"]\n"a."\n[]',
  sampleTestCase:
    '"Bob hit a ball, the hit BALL flew far after it was hit."\n["hit"]',
  metaData:
    '{\r\n  "name": "mostCommonWord",\r\n  "params": [\r\n    {\r\n      "name": "paragraph",\r\n      "type": "string"\r\n    },\r\n    {\r\n      "name": "banned",\r\n      "type": "string[]"\r\n    }\r\n  ],\r\n  "return": {\r\n    "type": "string"\r\n  }\r\n}\r\n',
};

const EASY_2 = {
  titleSlug: 'contains-duplicate',
  title: 'Contains Duplicate',
  questionId: '217',
  content:
    '<p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears <strong>at least twice</strong> in the array, and return <code>false</code> if every element is distinct.</p>\n\n<p>&nbsp;</p>\n<p><strong>Example 1:</strong></p>\n<pre><strong>Input:</strong> nums = [1,2,3,1]\n<strong>Output:</strong> true\n</pre><p><strong>Example 2:</strong></p>\n<pre><strong>Input:</strong> nums = [1,2,3,4]\n<strong>Output:</strong> false\n</pre><p><strong>Example 3:</strong></p>\n<pre><strong>Input:</strong> nums = [1,1,1,3,3,4,3,2,4,2]\n<strong>Output:</strong> true\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\n</ul>\n',
  difficulty: 'Easy',
  topics: ['Array', 'Hash Table', 'Sorting'],
  code: [
    {
      lang: 'Java',
      langSlug: 'java',
      code: 'class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        \n    }\n}',
    },
    {
      lang: 'Python',
      langSlug: 'python',
      code: 'class Solution(object):\n    def containsDuplicate(self, nums):\n        """\n        :type nums: List[int]\n        :rtype: bool\n        """\n        ',
    },
    {
      lang: 'JavaScript',
      langSlug: 'javascript',
      code: '/**\n * @param {number[]} nums\n * @return {boolean}\n */\nvar containsDuplicate = function(nums) {\n    \n};',
    },
  ],
  hints: [],
  exampleTestcases: '[1,2,3,1]\n[1,2,3,4]\n[1,1,1,3,3,4,3,2,4,2]',
  sampleTestCase: '[1,2,3,1]',
  metaData:
    '{\r\n  "name": "containsDuplicate",\r\n  "params": [\r\n    {\r\n      "name": "nums",\r\n      "type": "integer[]"\r\n    }\r\n  ],\r\n  "return": {\r\n    "type": "boolean"\r\n  }\r\n}',
};

const EASY_3 = {
  titleSlug: 'how-many-numbers-are-smaller-than-the-current-number',
  title: 'How Many Numbers Are Smaller Than the Current Number',
  questionId: '1482',
  content:
    '<p>Given the array <code>nums</code>, for each <code>nums[i]</code> find out how many numbers in the array are smaller than it. That is, for each <code>nums[i]</code> you have to count the number of valid <code>j&#39;s</code>&nbsp;such that&nbsp;<code>j != i</code> <strong>and</strong> <code>nums[j] &lt; nums[i]</code>.</p>\n\n<p>Return the answer in an array.</p>\n\n<p>&nbsp;</p>\n<p><strong>Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [8,1,2,2,3]\n<strong>Output:</strong> [4,0,1,1,3]\n<strong>Explanation:</strong> \nFor nums[0]=8 there exist four smaller numbers than it (1, 2, 2 and 3). \nFor nums[1]=1 does not exist any smaller number than it.\nFor nums[2]=2 there exist one smaller number than it (1). \nFor nums[3]=2 there exist one smaller number than it (1). \nFor nums[4]=3 there exist three smaller numbers than it (1, 2 and 2).\n</pre>\n\n<p><strong>Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [6,5,4,8]\n<strong>Output:</strong> [2,1,0,3]\n</pre>\n\n<p><strong>Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [7,7,7,7]\n<strong>Output:</strong> [0,0,0,0]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= nums.length &lt;= 500</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 100</code></li>\n</ul>\n',
  difficulty: 'Easy',
  topics: ['Array', 'Hash Table', 'Sorting', 'Counting'],
  code: [
    {
      lang: 'Java',
      langSlug: 'java',
      code: 'class Solution {\n    public int[] smallerNumbersThanCurrent(int[] nums) {\n        \n    }\n}',
    },
    {
      lang: 'Python',
      langSlug: 'python',
      code: 'class Solution(object):\n    def smallerNumbersThanCurrent(self, nums):\n        """\n        :type nums: List[int]\n        :rtype: List[int]\n        """\n        ',
    },
    {
      lang: 'JavaScript',
      langSlug: 'javascript',
      code: '/**\n * @param {number[]} nums\n * @return {number[]}\n */\nvar smallerNumbersThanCurrent = function(nums) {\n    \n};',
    },
  ],
  hints: [
    'Brute force for each array element.',
    'In order to improve the time complexity, we can sort the array and get the answer for each array element.',
  ],
  exampleTestcases: '[8,1,2,2,3]\n[6,5,4,8]\n[7,7,7,7]',
  sampleTestCase: '[8,1,2,2,3]',
  metaData:
    '{\n  "name": "smallerNumbersThanCurrent",\n  "params": [\n    {\n      "name": "nums",\n      "type": "integer[]"\n    }\n  ],\n  "return": {\n    "type": "integer[]"\n  }\n}',
};

const MEDIUM_1 = {
  titleSlug: 'filter-restaurants-by-vegan-friendly-price-and-distance',
  title: 'Filter Restaurants by Vegan-Friendly, Price and Distance',
  questionId: '1455',
  content:
    '<p>Given the array <code>restaurants</code> where &nbsp;<code>restaurants[i] = [id<sub>i</sub>, rating<sub>i</sub>, veganFriendly<sub>i</sub>, price<sub>i</sub>, distance<sub>i</sub>]</code>. You have to filter the restaurants using three filters.</p>\n\n<p>The <code>veganFriendly</code> filter will be either <em>true</em> (meaning you should only include restaurants with <code>veganFriendly<sub>i</sub></code> set to true)&nbsp;or <em>false</em>&nbsp;(meaning you can include any restaurant). In addition, you have the filters&nbsp;<code>maxPrice</code> and <code>maxDistance</code>&nbsp;which&nbsp;are the maximum value for price and distance of restaurants you should consider respectively.</p>\n\n<p>Return the array of restaurant <em><strong>IDs</strong></em> after filtering, ordered by <strong>rating</strong> from highest to lowest. For restaurants with the same rating, order them by <em><strong>id</strong></em> from highest to lowest. For simplicity <code>veganFriendly<sub>i</sub></code> and <code>veganFriendly</code> take value <em>1</em> when it is <em>true</em>, and <em>0</em> when it is <em>false</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong>Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> restaurants = [[1,4,1,40,10],[2,8,0,50,5],[3,8,1,30,4],[4,10,0,10,3],[5,1,1,15,1]], veganFriendly = 1, maxPrice = 50, maxDistance = 10\n<strong>Output:</strong> [3,1,5] \n<strong>Explanation: \n</strong>The restaurants are:\nRestaurant 1 [id=1, rating=4, veganFriendly=1, price=40, distance=10]\nRestaurant 2 [id=2, rating=8, veganFriendly=0, price=50, distance=5]\nRestaurant 3 [id=3, rating=8, veganFriendly=1, price=30, distance=4]\nRestaurant 4 [id=4, rating=10, veganFriendly=0, price=10, distance=3]\nRestaurant 5 [id=5, rating=1, veganFriendly=1, price=15, distance=1] \nAfter filter restaurants with veganFriendly = 1, maxPrice = 50 and maxDistance = 10 we have restaurant 3, restaurant 1 and restaurant 5 (ordered by rating from highest to lowest). \n</pre>\n\n<p><strong>Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> restaurants = [[1,4,1,40,10],[2,8,0,50,5],[3,8,1,30,4],[4,10,0,10,3],[5,1,1,15,1]], veganFriendly = 0, maxPrice = 50, maxDistance = 10\n<strong>Output:</strong> [4,3,2,1,5]\n<strong>Explanation:</strong> The restaurants are the same as in example 1, but in this case the filter veganFriendly = 0, therefore all restaurants are considered.\n</pre>\n\n<p><strong>Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> restaurants = [[1,4,1,40,10],[2,8,0,50,5],[3,8,1,30,4],[4,10,0,10,3],[5,1,1,15,1]], veganFriendly = 0, maxPrice = 30, maxDistance = 3\n<strong>Output:</strong> [4,5]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;=&nbsp;restaurants.length &lt;= 10^4</code></li>\n\t<li><code>restaurants[i].length == 5</code></li>\n\t<li><code>1 &lt;=&nbsp;id<sub>i</sub>, rating<sub>i</sub>, price<sub>i</sub>, distance<sub>i </sub>&lt;= 10^5</code></li>\n\t<li><code>1 &lt;=&nbsp;maxPrice,&nbsp;maxDistance &lt;= 10^5</code></li>\n\t<li><code>veganFriendly<sub>i</sub></code> and&nbsp;<code>veganFriendly</code>&nbsp;are&nbsp;0 or 1.</li>\n\t<li>All <code>id<sub>i</sub></code> are distinct.</li>\n</ul>\n',
  difficulty: 'Medium',
  topics: ['Array', 'Sorting'],
  code: [
    {
      lang: 'Java',
      langSlug: 'java',
      code: 'class Solution {\n    public List<Integer> filterRestaurants(int[][] restaurants, int veganFriendly, int maxPrice, int maxDistance) {\n        \n    }\n}',
    },
    {
      lang: 'Python',
      langSlug: 'python',
      code: 'class Solution(object):\n    def filterRestaurants(self, restaurants, veganFriendly, maxPrice, maxDistance):\n        """\n        :type restaurants: List[List[int]]\n        :type veganFriendly: int\n        :type maxPrice: int\n        :type maxDistance: int\n        :rtype: List[int]\n        """\n        ',
    },
    {
      lang: 'JavaScript',
      langSlug: 'javascript',
      code: '/**\n * @param {number[][]} restaurants\n * @param {number} veganFriendly\n * @param {number} maxPrice\n * @param {number} maxDistance\n * @return {number[]}\n */\nvar filterRestaurants = function(restaurants, veganFriendly, maxPrice, maxDistance) {\n    \n};',
    },
  ],
  hints: [
    'Do the filtering and sort as said. Note that the id may not be the index in the array.',
  ],
  exampleTestcases:
    '[[1,4,1,40,10],[2,8,0,50,5],[3,8,1,30,4],[4,10,0,10,3],[5,1,1,15,1]]\n1\n50\n10\n[[1,4,1,40,10],[2,8,0,50,5],[3,8,1,30,4],[4,10,0,10,3],[5,1,1,15,1]]\n0\n50\n10\n[[1,4,1,40,10],[2,8,0,50,5],[3,8,1,30,4],[4,10,0,10,3],[5,1,1,15,1]]\n0\n30\n3',
  sampleTestCase:
    '[[1,4,1,40,10],[2,8,0,50,5],[3,8,1,30,4],[4,10,0,10,3],[5,1,1,15,1]]\n1\n50\n10',
  metaData:
    '{\n  "name": "filterRestaurants",\n  "params": [\n    {\n      "name": "restaurants",\n      "type": "integer[][]"\n    },\n    {\n      "type": "integer",\n      "name": "veganFriendly"\n    },\n    {\n      "type": "integer",\n      "name": "maxPrice"\n    },\n    {\n      "type": "integer",\n      "name": "maxDistance"\n    }\n  ],\n  "return": {\n    "type": "list<integer>"\n  }\n}',
};

const MEDIUM_2 = {
  titleSlug: 'simplify-path',
  title: 'Simplify Path',
  questionId: '71',
  content:
    '<p>Given a string <code>path</code>, which is an <strong>absolute path</strong> (starting with a slash <code>&#39;/&#39;</code>) to a file or directory in a Unix-style file system, convert it to the simplified <strong>canonical path</strong>.</p>\n\n<p>In a Unix-style file system, a period <code>&#39;.&#39;</code> refers to the current directory, a double period <code>&#39;..&#39;</code> refers to the directory up a level, and any multiple consecutive slashes (i.e. <code>&#39;//&#39;</code>) are treated as a single slash <code>&#39;/&#39;</code>. For this problem, any other format of periods such as <code>&#39;...&#39;</code> are treated as file/directory names.</p>\n\n<p>The <strong>canonical path</strong> should have the following format:</p>\n\n<ul>\n\t<li>The path starts with a single slash <code>&#39;/&#39;</code>.</li>\n\t<li>Any two directories are separated by a single slash <code>&#39;/&#39;</code>.</li>\n\t<li>The path does not end with a trailing <code>&#39;/&#39;</code>.</li>\n\t<li>The path only contains the directories on the path from the root directory to the target file or directory (i.e., no period <code>&#39;.&#39;</code> or double period <code>&#39;..&#39;</code>)</li>\n</ul>\n\n<p>Return <em>the simplified <strong>canonical path</strong></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong>Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> path = &quot;/home/&quot;\n<strong>Output:</strong> &quot;/home&quot;\n<strong>Explanation:</strong> Note that there is no trailing slash after the last directory name.\n</pre>\n\n<p><strong>Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> path = &quot;/../&quot;\n<strong>Output:</strong> &quot;/&quot;\n<strong>Explanation:</strong> Going one level up from the root directory is a no-op, as the root level is the highest level you can go.\n</pre>\n\n<p><strong>Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> path = &quot;/home//foo/&quot;\n<strong>Output:</strong> &quot;/home/foo&quot;\n<strong>Explanation: </strong>In the canonical path, multiple consecutive slashes are replaced by a single one.\n</pre>\n\n<p><strong>Example 4:</strong></p>\n\n<pre>\n<strong>Input:</strong> path = &quot;/a/./b/../../c/&quot;\n<strong>Output:</strong> &quot;/c&quot;\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= path.length &lt;= 3000</code></li>\n\t<li><code>path</code> consists of English letters, digits, period <code>&#39;.&#39;</code>, slash <code>&#39;/&#39;</code> or <code>&#39;_&#39;</code>.</li>\n\t<li><code>path</code> is a valid absolute Unix path.</li>\n</ul>\n',
  difficulty: 'Medium',
  topics: ['String', 'Stack'],
  code: [
    {
      lang: 'Java',
      langSlug: 'java',
      code: 'class Solution {\n    public String simplifyPath(String path) {\n        \n    }\n}',
    },
    {
      lang: 'Python',
      langSlug: 'python',
      code: 'class Solution(object):\n    def simplifyPath(self, path):\n        """\n        :type path: str\n        :rtype: str\n        """\n        ',
    },
    {
      lang: 'JavaScript',
      langSlug: 'javascript',
      code: '/**\n * @param {string} path\n * @return {string}\n */\nvar simplifyPath = function(path) {\n    \n};',
    },
  ],
  hints: [],
  exampleTestcases: '"/home/"\n"/../"\n"/home//foo/"\n"/a/./b/../../c/"',
  sampleTestCase: '"/home/"',
  metaData:
    '{ \r\n  "name": "simplifyPath",\r\n  "params": [\r\n    { \r\n      "name": "path",\r\n      "type": "string"\r\n    }\r\n  ],\r\n  "return": {\r\n    "type": "string"\r\n  }\r\n}',
};

const MEDIUM_3 = {
  titleSlug: 'count-submatrices-with-all-ones',
  title: 'Count Submatrices With All Ones',
  questionId: '1628',
  content:
    '<p>Given a&nbsp;<code>rows * columns</code>&nbsp;matrix <code>mat</code> of ones and zeros, return how many&nbsp;<strong>submatrices</strong> have all ones.</p>\r\n\r\n<p>&nbsp;</p>\r\n<p><strong>Example 1:</strong></p>\r\n\r\n<pre>\r\n<strong>Input:</strong> mat = [[1,0,1],\r\n&nbsp;             [1,1,0],\r\n&nbsp;             [1,1,0]]\r\n<strong>Output:</strong> 13\r\n<strong>Explanation:\r\n</strong>There are <b>6</b> rectangles of side 1x1.\r\nThere are <b>2</b> rectangles of side 1x2.\r\nThere are <b>3</b> rectangles of side 2x1.\r\nThere is <b>1</b> rectangle of side 2x2. \r\nThere is <b>1</b> rectangle of side 3x1.\r\nTotal number of rectangles = 6 + 2 + 3 + 1 + 1 = <strong>13.</strong>\r\n</pre>\r\n\r\n<p><strong>Example 2:</strong></p>\r\n\r\n<pre>\r\n<strong>Input:</strong> mat = [[0,1,1,0],\r\n&nbsp;             [0,1,1,1],\r\n&nbsp;             [1,1,1,0]]\r\n<strong>Output:</strong> 24\r\n<strong>Explanation:</strong>\r\nThere are <b>8</b> rectangles of side 1x1.\r\nThere are <b>5</b> rectangles of side 1x2.\r\nThere are <b>2</b> rectangles of side 1x3. \r\nThere are <b>4</b> rectangles of side 2x1.\r\nThere are <b>2</b> rectangles of side 2x2. \r\nThere are <b>2</b> rectangles of side 3x1. \r\nThere is <b>1</b> rectangle of side 3x2. \r\nTotal number of rectangles = 8 + 5 + 2 + 4 + 2 + 2 + 1 = 24<strong>.</strong>\r\n</pre>\r\n\r\n<p><strong>Example 3:</strong></p>\r\n\r\n<pre>\r\n<strong>Input:</strong> mat = [[1,1,1,1,1,1]]\r\n<strong>Output:</strong> 21\r\n</pre>\r\n\r\n<p><strong>Example 4:</strong></p>\r\n\r\n<pre>\r\n<strong>Input:</strong> mat = [[1,0,1],[0,1,0],[1,0,1]]\r\n<strong>Output:</strong> 5\r\n</pre>\r\n\r\n<p>&nbsp;</p>\r\n<p><strong>Constraints:</strong></p>\r\n\r\n<ul>\r\n\t<li><code>1 &lt;= rows&nbsp;&lt;= 150</code></li>\r\n\t<li><code>1 &lt;= columns&nbsp;&lt;= 150</code></li>\r\n\t<li><code>0 &lt;= mat[i][j] &lt;= 1</code></li>\r\n</ul>',
  difficulty: 'Medium',
  topics: [
    'Array',
    'Dynamic Programming',
    'Stack',
    'Matrix',
    'Monotonic Stack',
  ],
  code: [
    {
      lang: 'Java',
      langSlug: 'java',
      code: 'class Solution {\n    public int numSubmat(int[][] mat) {\n        \n    }\n}',
    },
    {
      lang: 'Python',
      langSlug: 'python',
      code: 'class Solution(object):\n    def numSubmat(self, mat):\n        """\n        :type mat: List[List[int]]\n        :rtype: int\n        """\n        ',
    },
    {
      lang: 'JavaScript',
      langSlug: 'javascript',
      code: '/**\n * @param {number[][]} mat\n * @return {number}\n */\nvar numSubmat = function(mat) {\n    \n};',
    },
  ],
  hints: [
    'For each row i, create an array nums where:  if mat[i][j] == 0 then nums[j] = 0 else nums[j] = nums[j-1] +1.',
    'In the row i, number of rectangles between column j and k(inclusive) and ends in row i, is equal to SUM(min(nums[j, .. idx])) where idx go from j to k.  Expected solution is O(n^3).',
  ],
  exampleTestcases:
    '[[1,0,1],[1,1,0],[1,1,0]]\n[[0,1,1,0],[0,1,1,1],[1,1,1,0]]\n[[1,1,1,1,1,1]]\n[[1,0,1],[0,1,0],[1,0,1]]',
  sampleTestCase: '[[1,0,1],[1,1,0],[1,1,0]]',
  metaData:
    '{\n  "name": "numSubmat",\n  "params": [\n    {\n      "name": "mat",\n      "type": "integer[][]"\n    }\n  ],\n  "return": {\n    "type": "integer"\n  }\n}',
};

const HARD_1 = {
  titleSlug: 'max-chunks-to-make-sorted-ii',
  title: 'Max Chunks To Make Sorted II',
  questionId: '779',
  content:
    '<p>You are given an integer array <code>arr</code>.</p>\n\n<p>We split <code>arr</code> into some number of <strong>chunks</strong> (i.e., partitions), and individually sort each chunk. After concatenating them, the result should equal the sorted array.</p>\n\n<p>Return <em>the largest number of chunks we can make to sort the array</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong>Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> arr = [5,4,3,2,1]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong>\nSplitting into two or more chunks will not return the required result.\nFor example, splitting into [5, 4], [3, 2, 1] will result in [4, 5, 1, 2, 3], which isn&#39;t sorted.\n</pre>\n\n<p><strong>Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> arr = [2,1,3,4,4]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong>\nWe can split into two chunks, such as [2, 1], [3, 4, 4].\nHowever, splitting into [2, 1], [3], [4], [4] is the highest number of chunks possible.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= arr.length &lt;= 2000</code></li>\n\t<li><code>0 &lt;= arr[i] &lt;= 10<sup>8</sup></code></li>\n</ul>\n',
  difficulty: 'Hard',
  topics: ['Array', 'Stack', 'Greedy', 'Sorting', 'Monotonic Stack'],
  code: [
    {
      lang: 'Java',
      langSlug: 'java',
      code: 'class Solution {\n    public int maxChunksToSorted(int[] arr) {\n        \n    }\n}',
    },
    {
      lang: 'Python',
      langSlug: 'python',
      code: 'class Solution(object):\n    def maxChunksToSorted(self, arr):\n        """\n        :type arr: List[int]\n        :rtype: int\n        """\n        ',
    },
    {
      lang: 'JavaScript',
      langSlug: 'javascript',
      code: '/**\n * @param {number[]} arr\n * @return {number}\n */\nvar maxChunksToSorted = function(arr) {\n    \n};',
    },
  ],
  hints: [
    'Each k for which some permutation of arr[:k] is equal to sorted(arr)[:k] is where we should cut each chunk.',
  ],
  exampleTestcases: '[5,4,3,2,1]\n[2,1,3,4,4]',
  sampleTestCase: '[5,4,3,2,1]',
  metaData:
    '{\r\n  "name": "maxChunksToSorted",\r\n  "params": [\r\n    {\r\n      "name": "arr",\r\n      "type": "integer[]"\r\n    }\r\n  ],\r\n  "return": {\r\n    "type": "integer"\r\n  }\r\n}\r\n',
};

const HARD_2 = {
  titleSlug: 'super-palindromes',
  title: 'Super Palindromes',
  questionId: '942',
  content:
    '<p>Let&#39;s say a positive integer is a <strong>super-palindrome</strong> if it is a palindrome, and it is also the square of a palindrome.</p>\n\n<p>Given two positive integers <code>left</code> and <code>right</code> represented as strings, return <em>the number of <strong>super-palindromes</strong> integers in the inclusive range</em> <code>[left, right]</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong>Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> left = &quot;4&quot;, right = &quot;1000&quot;\n<strong>Output:</strong> 4\n<strong>Explanation</strong>: 4, 9, 121, and 484 are superpalindromes.\nNote that 676 is not a superpalindrome: 26 * 26 = 676, but 26 is not a palindrome.\n</pre>\n\n<p><strong>Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> left = &quot;1&quot;, right = &quot;2&quot;\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= left.length, right.length &lt;= 18</code></li>\n\t<li><code>left</code> and <code>right</code> consist of only digits.</li>\n\t<li><code>left</code> and <code>right</code> cannot have leading zeros.</li>\n\t<li><code>left</code> and <code>right</code> represent integers in the range <code>[1, 10<sup>18</sup> - 1]</code>.</li>\n\t<li><code>left</code> is less than or equal to <code>right</code>.</li>\n</ul>\n',
  difficulty: 'Hard',
  topics: ['Math', 'Enumeration'],
  code: [
    {
      lang: 'Java',
      langSlug: 'java',
      code: 'class Solution {\n    public int superpalindromesInRange(String left, String right) {\n        \n    }\n}',
    },
    {
      lang: 'Python',
      langSlug: 'python',
      code: 'class Solution(object):\n    def superpalindromesInRange(self, left, right):\n        """\n        :type left: str\n        :type right: str\n        :rtype: int\n        """\n        ',
    },
    {
      lang: 'JavaScript',
      langSlug: 'javascript',
      code: '/**\n * @param {string} left\n * @param {string} right\n * @return {number}\n */\nvar superpalindromesInRange = function(left, right) {\n    \n};',
    },
  ],
  hints: [],
  exampleTestcases: '"4"\n"1000"\n"1"\n"2"',
  sampleTestCase: '"4"\n"1000"',
  metaData:
    '{\n  "name": "superpalindromesInRange",\n  "params": [\n    {\n      "name": "left",\n      "type": "string"\n    },\n    {\n      "name": "right",\n      "type": "string"\n    }\n  ],\n  "return": {\n    "type": "integer"\n  }\n}',
};

const HARD_3 = {
  titleSlug: 'equal-rational-numbers',
  title: 'Equal Rational Numbers',
  questionId: '1012',
  content:
    '<p>Given two strings <code>s</code> and <code>t</code>, each of which represents a non-negative rational number, return <code>true</code> if and only if they represent the same number. The strings may use parentheses to denote the repeating part of the rational number.</p>\n\n<p>A <strong>rational number</strong> can be represented using up to three parts: <code>&lt;IntegerPart&gt;</code>, <code>&lt;NonRepeatingPart&gt;</code>, and a <code>&lt;RepeatingPart&gt;</code>. The number will be represented in one of the following three ways:</p>\n\n<ul>\n\t<li><code>&lt;IntegerPart&gt;</code>\n\n\t<ul>\n\t\t<li>For example, <code>12</code>, <code>0</code>, and <code>123</code>.</li>\n\t</ul>\n\t</li>\n\t<li><code>&lt;IntegerPart&gt;<strong>&lt;.&gt;</strong>&lt;NonRepeatingPart&gt;</code>\n\t<ul>\n\t\t<li>For example, <code>0.5</code>, <code>1.</code>, <code>2.12</code>, and <code>123.0001</code>.</li>\n\t</ul>\n\t</li>\n\t<li><code>&lt;IntegerPart&gt;<strong>&lt;.&gt;</strong>&lt;NonRepeatingPart&gt;<strong>&lt;(&gt;</strong>&lt;RepeatingPart&gt;<strong>&lt;)&gt;</strong></code>\n\t<ul>\n\t\t<li>For example, <code>0.1(6)</code>, <code>1.(9)</code>, <code>123.00(1212)</code>.</li>\n\t</ul>\n\t</li>\n</ul>\n\n<p>The repeating portion of a decimal expansion is conventionally denoted within a pair of round brackets. For example:</p>\n\n<ul>\n\t<li><code>1/6 = 0.16666666... = 0.1(6) = 0.1666(6) = 0.166(66)</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;0.(52)&quot;, t = &quot;0.5(25)&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> Because &quot;0.(52)&quot; represents 0.52525252..., and &quot;0.5(25)&quot; represents 0.52525252525..... , the strings represent the same number.\n</pre>\n\n<p><strong>Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;0.1666(6)&quot;, t = &quot;0.166(66)&quot;\n<strong>Output:</strong> true\n</pre>\n\n<p><strong>Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;0.9(9)&quot;, t = &quot;1.&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> &quot;0.9(9)&quot; represents 0.999999999... repeated forever, which equals 1.  [<a href="https://en.wikipedia.org/wiki/0.999..." target="_blank">See this link for an explanation.</a>]\n&quot;1.&quot; represents the number 1, which is formed correctly: (IntegerPart) = &quot;1&quot; and (NonRepeatingPart) = &quot;&quot;.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>Each part consists only of digits.</li>\n\t<li>The <code>&lt;IntegerPart&gt;</code> does not have leading zeros (except for the zero itself).</li>\n\t<li><code>1 &lt;= &lt;IntegerPart&gt;.length &lt;= 4</code></li>\n\t<li><code>0 &lt;= &lt;NonRepeatingPart&gt;.length &lt;= 4</code></li>\n\t<li><code>1 &lt;= &lt;RepeatingPart&gt;.length &lt;= 4</code></li>\n</ul>\n',
  difficulty: 'Hard',
  topics: ['Math', 'String'],
  code: [
    {
      lang: 'Java',
      langSlug: 'java',
      code: 'class Solution {\n    public boolean isRationalEqual(String s, String t) {\n        \n    }\n}',
    },
    {
      lang: 'Python',
      langSlug: 'python',
      code: 'class Solution(object):\n    def isRationalEqual(self, s, t):\n        """\n        :type s: str\n        :type t: str\n        :rtype: bool\n        """\n        ',
    },
    {
      lang: 'JavaScript',
      langSlug: 'javascript',
      code: '/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nvar isRationalEqual = function(s, t) {\n    \n};',
    },
  ],
  hints: [],
  exampleTestcases:
    '"0.(52)"\n"0.5(25)"\n"0.1666(6)"\n"0.166(66)"\n"0.9(9)"\n"1."',
  sampleTestCase: '"0.(52)"\n"0.5(25)"',
  metaData:
    '{\n  "name": "isRationalEqual",\n  "params": [\n    {\n      "name": "s",\n      "type": "string"\n    },\n    {\n      "name": "t",\n      "type": "string"\n    }\n  ],\n  "return": {\n    "type": "boolean"\n  }\n}',
};

export const QUESTIONS = [
  EASY_1,
  EASY_2,
  EASY_3,
  MEDIUM_1,
  MEDIUM_2,
  MEDIUM_3,
  HARD_1,
  HARD_2,
  HARD_3,
];
