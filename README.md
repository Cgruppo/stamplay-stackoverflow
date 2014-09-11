stamplay-stackoverflow
======================

![Stackoverflow](http://blog.stamplay.com/wp-content/uploads/2014/09/Schermata-2014-09-09-alle-15.24.13.png "Stackoverflow")

**Here at [Stamplay](https://stamplay.com) we really love [AngularJS](http://angularjs.org) so, after using it to create a [food ordering](https://github.com/Stamplay/stamplay-foodme) app like JustEat, we decided to use it again for our next tutorial. When it comes to solve any kind of unexpected problems while coding there is only one place that makes everyone confident about finding the right answer, and its name is [Stackoverflow](http://stackoverflow). So this time, as a tribute to this outstanding community, we dedicate this tutorial to it.**

It's somewhat a clone of [Stackoverflow](http://stackoverflow) and here you can see it up and running [https://bb76d7.stamplay.com](https://bb76d7.stamplay.com)

We love javascript and front end framework and this time we show you how you can create this app using [AngularJS](http://angularjs.org) to implement the client side logic. Here are the user stories for this example:

* as a guest user I can read and search every question and its answer available on the website
* as a guest user I can list all tags, users, filter and sort the questions on the website
* as a guest user I can signup using my GitHub account to be able to interact with the content of the website.
* as a logged user I can ask a new question to the community
* as a logged user I can upvote/downvote a question
* as a logged user I can upvote/downvote an answer
* as a logged user and author of a question I can mark as “correct” one of the answer received

Best of all, we used AngularJS :) Prepare to be amazed.

You can test it anytime simply creating a new project on Stamplay and uploading all the frontend assets with our client or our browser based code editor. 

Feel free to implement more cool features (see the last paragraph for ideas), contribute to this repo or clone it to use it by your own scopes. For any question drop an email to [giuliano.iacobelli@stamplay.com](mailto:giuliano.iacobelli@stamplay.com)


-----------------------
# Anatomy

This Stackoverflow clone is built around the following building blocks

* [Users](https://www.stamplay.com/docs#user)
* [Gamification](http://stamplay.com/docs#challenge-challenge)
* [Custom Objects](https://www.stamplay.com/docs#customobject)
* [Email](https://www.stamplay.com/docs#email)


## Requirements

Go to [your account](http://editor.stamplay.com/apps) and create a new app.

## Configuring the components

After creating a new app on [Stamplay](https://editor.stamplay.com) let's start by picking the component we want to use in our app that are: **User**, **Gamification**, **Email**, **Mailchimp** and **Custom Objects**.

Lets see one-by-one how they are configured:

### User
Since this is something for developers we decided to make our users signup with our last OAuth integration, Github. To get your own credentials go to [https://github.com/settings/applications](https://github.com/settings/applications) and click on "Register a new app". Fill the "Authorized Redirect URIs" with the URL: **https://[appId].stamplay.com/auth/v0/github/callback** and you'll have your ClientId and Secret to fill the fields as you can see from the image below. 

![Github OAuth](http://blog.stamplay.com/wp-content/uploads/2014/09/Schermata-2014-09-09-alle-16.27.56.png "Github OAuth")

![Github login](http://blog.stamplay.com/wp-content/uploads/2014/09/Schermata-2014-09-09-alle-15.37.21.png "Github login")


### Custom Object
Let's define the entities for this app, we will define **Question**, **Answer** and **Tag** that are defined as follows:

##### Question

* Name: `title`, Type: `string`, required, the question’s title
* Name: `text`, Type: `string`, required, the question’s body
* Name: `author`, Type: `user_relation`, required, the author of the question (it will contain one user’s _id)
* Name: `views`, Type: `number`, optional, the number of times a question has been viewed by a logged user
* Name: `answers`, Type: `collection of tags`, answers posted for the current question listed as an array of **answer**'s `_id` s
* Name: `tags`, Type: `collection of tags`, tags related to the current question listed as an array of **tag**'s `_id` s

##### Answer

the answers posted in relation to a question. It has a simpler structure than the questions that is

* Name: `author`, Type: `user_relation`, required, the author of the question (it will contain one user’s _id)
* Name: `text`, Type: `string`, required, the answer’s body
* Name: `checked`, Type: `boolean`, optional, set to “true” if this answer has been flagged as the good one

##### Tag

the tags that can be associated to a question. These can be created only by the admin:

* Name: `name`, Type: `string`, unique, required, tag's name
* Name: `count`, Type: `number`, optional, how many questions have been tagged with the tag
* Name: `excerpt`, Type: `string`, optional, tag’s short description

After setting up this Stamplay will instantly expose Restful APIs for our newly resources the following URIs: 

* `https://APPID.stamplay.com/api/cobject/v0/question`
* `https://APPID.stamplay.com/api/cobject/v0/answer`
* `https://APPID.stamplay.com/api/cobject/v0/tag`



### Gamification
User activity on Stackoverflow is rewarded with reputation points, this component empower you to add gamification mechanics by defining challenges and achievements in your app. In this way we will be able to give points to users who receive upvotes on their answers and their questions without having to write a single server side line of code. Let's pick Gamification component and name our challenge `stack-challenge`, we don 't care about badges and level but feel free to add yours

![Gamification settings](http://blog.stamplay.com/wp-content/uploads/2014/09/Schermata-2014-09-09-alle-17.00.18.png)


### Email
This component doesn't need any setup, couldn't be easier than that ;)


### Mailchimp (optional)
Being able to talk to our users is always an important thing to care about. To do this we will rely on Mailchimp to send them periodic newsletters and rely on Stamplay's engine to subscribe to a list every user who signs up to our service.
To push email addresses of app's users to a Mailchimp list you only need to connect your account. Just click the "Connect" button and authorize Stamplay in interacting with your Mailchimp data.


-----------------------


## Creating the server side logic with Tasks

Now let's add the tasks that will define the server side of our app. For our app we want that:

### When a user signs up, join the stack-challenge to be able to earn points

Trigger : User - Signup

Action: Gamification - Join Challenge

**User signup configuration**

	none

**Gamification Join Challenge configuration**

	challenge: stack-challenge


### When a user signs up, add him to my Mailchimp list

Trigger : User - Signup

Action: Mailchimp - Subscribe to a List

**User signup configuration**

	none

**Mailchimp Subscribe to a List configuration**

	list: Your-mailchimp-list
	email: {{user.email}}
	update existing: Yes
	send welcome message: No
	first name: {{user.name.givenName}}
	last name: {{user.name.familyName}}

### When a question is up voted, its author get 5 points

Trigger : Custom Object - Upvote

Action: Gamification - Add Points

**Question Upvote configuration**

	Custom Object: Question

**Gamification Add Points configuration**

	challenge: stack-challenge
	numpoints: 5
	user: {{coinstance.author}}

### When a question is down voted, its author loose 2 points

Trigger : Custom Object - Downvote

Action: Gamification - Add Points

**Question Upvote configuration**

	Custom Object: Question

**Gamification Add Points configuration**

	challenge: stack-challenge
	numpoints: -2
	user: {{coinstance.author}}

### When an answer is up voted, its author get 10 points

Trigger : Custom Object - Upvote

Action: Gamification - Add Points

**Question Upvote configuration**

	Custom Object: Answer

**Gamification Add Points configuration**

	challenge: stack-challenge
	numpoints: 10
	user: {{coinstance.author}}

### When an answer is down voted, its author get -2 points

Trigger : Custom Object - Downvote

Action: Gamification - Add Points

**Question Upvote configuration**

	Custom Object: Answer

**Gamification Add Points configuration**

	challenge: stack-challenge
	numpoints: -2
	user: {{coinstance.author}}



_______________________________


# The frontend and AngularJS

The Angular app is organized with a router, a service and some controllers to handle the front end logic. Let's analyze more in depth how they're defined.


### Router (router.js)

The router is responsible for markup interpolation (the tag that makes AngularJS react while parsing the DOM). Since Stamplay leverages the double curly bracket signature `{{}}` cause it leverages Handlebars for server-side page rendering we will tell Angular to look for the double square brackets signature `[[]]`. 
Anyway the main scope of the router is to list the urls that our AngularJS app need to resolve. The routes are:

* `/auth/v0/github/connect`
* `/auth/v0/logout`
* `/answer[?id=question_id]`  - to show answers for a given question
* `/index` - to show the home pages
* `/questions` - to show questions
* `/tags` - to show tags
* `/users` - to show users

When routes are initialized, AngularJS start the app injecting in the `rootScope` the `user` that will be retrieved from the server if the user is logged in.


### Controllers

##### Login controller (loginCtrl.js):
Handles user login redirecting the browser to the auth start flow URL acting on the `window.location.href` property.

##### Logout controller (logoutCtrl.js):
Handles user logout redirecting the browser to the logout URL acting on the `window.location.href` property.

##### Home controller (homeCtrl.js)
`$scope` stores the `sort` criteria currently used to list the questions. (I.E: `sort: {newest: true, votes: false, active:false}`. When the controller starts `loadQuestion` is triggered and it loads questions, their authors and also checks if a "checked" (correct) answer already exists. `updateSortingOptions` is called when we need to change the sort criteria.

##### Answer controller (answerCtrl.js)
This controller is responsible to enable/disable UI controls in the view that show the details and the answers of a question. It checks if the user looking at it is the author (so that he can eventually check answers as correct) or if the user previously voted for it. The main functions defined here are: `setChecked`, `comment`, `voteUp` and `voteDown`

##### Create Question controller (createQuestionCtrl.js)
When this controller starts it initializes two variables in the `$scope`: `cobj` and `questionSubmitted`. The former represent the new instance for the question while the latter is a boolean value to check that the question has been submitted succesfully.
It also implement the function `getTags` for autocompleting the tag that users can bind to the question.

##### Tags controller (tagsCtrl.js)
All tags are loaded through the service exposed when the controller starts. AngularJS takes care of sorting it. In case of search it will perform new requests to the server to fetch tags accordingly with the desired search.

##### Users controller (usersCtrl.js)
Tutti gli utenti vengono caricati attraverso il resolve del router, funzione search 

### Dependencies
To complete the project we used the following great libs:

* Bootstrap 3.2.0
* Font awesome 4.1.0
* jQuery 1.11.1
* Angular 1.2.21
* Angular route 1.2.21
* Angular ui-boostrap 0.11.0
* Textangular 1.2.2
* Async 0.9.0


-----------------------


# Managing the app

Everytime you create reasource using Custom Object you can manage instances of the entities in the Admin section. This will let you to easily add edit and delete restaurant, meals and orders.

![Manage Restaurant](http://blog.stamplay.com/wp-content/uploads/2014/09/Schermata-2014-09-03-alle-14.05.29.png "Manage restaurant")


-----------------------
# Cloning

First, clone this repository :

    git clone git@github.com:Stamplay/stamplay-stackoverflow
    
Or download it as a zip file
	
	https://github.com/Stamplay/stamplay-stackoverflow/archive/master.zip 

Then you need to upload the frontend files in your app and you can do it in two ways:

* Copy/Upload them via the Layout section of your app on Stamplay editor
* [Get Stamplay sync](http://cdn.stamplay.com/stamplay-sync/stamplay-sync.zip) and run **Stamplay Sync**, make it download the frontend assets of your app and then replace them with the ones you got from this repo. Stamplay Sync will upload everything for you on your app.


-----------------------
# Next steps

Here are a few ideas for further improvement :

* bring together login and registration controllers by creating a single page to handle both user login and signup
* add social login like Facebook or Google to enrich user's identity
* if the cart contains more occurencies of a meal, group them
* let users to comment on the restaurants
* _Your idea here… ?_

Again, for any questions drop an email to [giuliano.iacobelli@stamplay.com](mailto:giuliano.iacobelli@stamplay.com) :)

Ciao!
