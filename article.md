Routing is an important part of every front-end application. It allows to organize the application as small chunks. At the same time, it provides a friendly experience for the users of the application as they can switch between different parts of the application, bookmark URLs, share URLs with others and use browser’s history to navigate between the states of the application that the user has seen before. A react application is no different. This article will explain you the process of adding routes to a react application.

## Setup
To follow along with this article and create the demo application, you will have to install the following softwares installed:

 - [Node.js](nodejs.org)
 - [VS Code](https://code.visualstudio.com/docs/setup/setup-overview)
 - npm 5.2 or above
 - [yarn](https://yarnpkg.com/en/)

After installing Node.js, check the version of npm and if it is below 5.2, you can upgrade using the following command:

> npm update -g npm

The reason for upgrading npm is, from version 5.2 npm comes with the package runner tool [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b). npx helps in reducing time and energy while using global npm packages. To create a React application, we need the package create-react-app. With npx, we can use the create-react-app package without installing it globally. The following npx command creates the new application:

> npx create-react-app my-app

Once the application is created and the packages are installed, it can be executed using one of the following commands:

> npm start

or

> yarn start

This command starts the React application on port 3000.

## Building an Application
Let's build an application to explore some features of React router. The application will use the GitHub API to fetch details of a GitHub organization. Then it will display the list of repos and the list of members on different pages. The application will have one more page to show the details of a member, this page will be reachable through the members list page.

As first thing, let's create the application and install the required packages in it. Run the following command to generate the project:

> npx create-react-app github-org

Move to the newly created folder on a terminal. Run the application using the `npm start` command and you will see the basic react application running on the browser.

Let's install the packages required. We need to install `react-router-dom` package to be able to use routes and `bootstrap` to use styles in the application. The following commands install these packages:

> yarn add react-router-dom
> yarn add bootstrap

Now these packages can be imported into the application and used. The following statement imports Bootstrap's CSS file into the application:

```
import 'bootstrap/dist/css/bootstrap.css';
```

Let's add some routes to the application. Add the following import statement to the fole `App.js`:

```
import { Route } from 'react-router-dom';
```

