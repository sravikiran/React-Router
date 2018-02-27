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

Let's add some routes to the application. To use the routes, the `App` component has to be rendered inside the `BrowserRouter` component. This component adds the capabilities of routing to the React web application. Open the file `index.js` and change the code in this file as shown below:

```
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
<BrowserRouter>
	<App />
</BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
```

### Adding Routes to Show Repos and Members
Now we can define routes and use them. Before creating a route, let's create a component to be rendered inside the route. Add a new file to the `src` folder and name it `Repos.js`. Add the following code to this file:

```
import React, { Component } from 'react';

export class Repos extends Component {
	render() {
		return <div>We will list the repos here!</div>;
	}
}
```

This component can be used to define a route. Open the file `App.js` and change the code in this file as shown below:

```
import React, { Component } from 'react';
import { Route } from 'react-router-dom';  // 1
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Repos } from './Repos';  // 2

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Route path="/repos" component={Repos}></Route>  {/* 3 */}
      </div>
    );
  }
}

export default App;
```

The new or modified lines in the above snippet are marked with comments and they are explained below:

1. Importing the `Route` component
2. Importing the new component to be rendered inside the route
3. This statement defines the route. When React Router encounters the relative path `/repos`, the component `Repo` is rendered in place of the Route component. The `Route` component performs two things here. One is, it configures the route and tells what to o when a URL is reached. The other is, it acts as the placeholder for the component referred by the route.

Save these changes and run the application. You will see the header alone rendered on the page. This is because, the browser has the URL http://localhost:3000 and it points to the root of the application. Change the URL to http://localhost:3000/repos and you will see the content of the new component on the page.

[Figure 1]

To render this component by default on the page, the route configuration has to be modified. Change the `Route` component in the file `App.js` as follows:

```
<Route path="/" component={Repos}></Route>
```

Change the URL to http://localhost:3000 after saving this change and now you will see the component `Repos` rendered.

Let's modify the `Repos` component to show the repositories under the Facebook organization on GitHub. To keep the logic of fetching data separated, the code interacting with the GitHub API will be kept in a separate class. Add a new file and name it `githubData.js`. Add the following code to this file:

```
class GithubData {
	org = 'facebook';
	orgBaseUrl = 'https://api.github.com/orgs/';

	constructor() {
		this.headers = new Headers();
		this.headers.append('Accept', 'application/vnd.github.v3+json');
	}

	getRepos(orgName) {
		let request = new Request(`${this.orgBaseUrl}${this.org}/repos`, { headers: this.headers });

		return fetch(request).then((res) => {
			return res.json();
		});
	}
}

export let githubDataProvider = new GithubData();
```

This snippet uses the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to call the GitHub API. The `getRepos` method gets the list of repositories and returns it. While sending request to the GitHub API, it is mandatory to send the header parameter `Accept`. So, this setting is added to the property `headers` in the class, so that it can be reused.

Now we need to modify the `Repos` component to use this data. The component will display this data in a table. The structure of the table would be created in the `render` method and it fetches the data after the component is mounted 

Now we need to modify the `Repos` component to use this data. The component will display this data in a table. The structure of the table would be created in the `render` method and the data would be fetched in the `componentDidMount` method, once the component is ready on the page. The `render` method will return the JSX that is needed initially to show on the page and the `componentDidMount` method build JSX for the content of the table once the data is fetched. The following snippet shows code of the modified component:

```
import React, { Component } from 'react';
import { githubDataProvider } from './githubData';

export class Repos extends Component {
	constructor() {
		super();
		this.state = {
			repos: []
		};
	}

	componentDidMount() {
		githubDataProvider.getRepos()
			.then((repos) => {
				let rows = repos.map(repo => {
					let link = repo.homepage ? <a href={repo.homepage} target='_blank'>Home Page</a> : <span>-</span>;
					return <tr key={repo.id}>
						<td> {repo.name} </td>
						<td>	{repo.stargazers_count}	</td>
						<td>	{repo.watchers_count}	</td>
						<td>	{repo.forks_count}	</td>
						<td>	{repo.open_issues_count}	</td>
						<td> {link} </td>
					</tr>
				});

				this.setState({ repos: rows });
			});
	}

	render() {
		return <div>
			<h3>Repos in the org {githubDataProvider.org}</h3>
			<table className="table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Stars</th>
						<th>Watches</th>
						<th>Forks</th>
						<th>Issues</th>
						<th>Home Page</th>
					</tr>
				</thead>
				<tbody>
					{this.state.repos}
				</tbody>
			</table>
		</div>;
	}
}
```

As you see, body of the table is bound to the `repos` property on the `state` of the component. This property is initialized with an empty array and the array is filled with data after the data is loaded from the GitHub API. Once the page is rendered, you will see a table similar to the following image on the page:

[Figure 2]

Now that the repos page is ready, let's add another page to show the members in the organization. To fetch the members of the organization, add the following code to the `GithubData` class:

```
getMembers(orgName) {
  let request =  new Request(`${this.orgBaseUrl}${this.org}/members`, { headers: this.headers });
  return fetch(request).then((res) => {
    return res.json()
      .then(members => {
        return members;
      });
    });
}
```

Add a new file to the `src` folder and name it `Members.js`. The `Members` component will have similar structure as the `Repos` component. It will build the initial content in the `render` method and the members list will be created in the `componentDidMount` method. Instead of showing the list of members in a table, it will create a tile view to display the avatars of the members and will have a few links to the profile of the member. The following snippet shows code of this component:

```
import React, { Component } from 'react';
import { githubDataProvider } from './githubData';
import { Link, withRouter } from 'react-router-dom';

export class Members extends Component {
	constructor() {
		super();
		this.state = {
			members: []
		};
	}

	componentDidMount() {
		githubDataProvider.getMembers()
			.then(members => {
				let membersjsx = members.map(member => {
					return <div className='col-md-3 tile' key={member.login}>
						<div>
							<img src={member.avatar_url} alt={member.login} className='avatar' />
						</div>
						<div>
							<a target='_blank' className='text-left' href={member.html_url}>{member.login}</a>
							<br />
							<a target='_blank' href={member.html_url + '?tab=repositories'}>Repos</a>
							<br />
							<Link to={`/member/${member.login}`}>View Details</Link>
						</div>
					</div>;
				});

				this.setState({ members: membersjsx });
			});
	}

	render() {
		return <div>
			<h3>Members of the {githubDataProvider.org} organization</h3>
			<div className='row'>
				{this.state.members}
			</div>
		</div>;
	}
}
```

The `Membbers` component uses the following styles to format the images and the tiles, add them to the `App.css` file:

```
.avatar{
height: 170px;
width: 170px;
}

.tile{
margin-top: 10px;
}
```

Now the `App` component has to be modified to show either `Repos` component or the `Members` component depending on the URL. The `Members` component will have its own `Route` configuration. To show one of these routes, we need to use the `Switch` component. Change the code in the file `App.js` as shown below:

```

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'; // 1
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Repos } from './Repos'; // 2
import { Members } from './Members';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Switch>
          <Route path='/' component={Repos}></Route>
          <Route path='/members' component={Members}></Route>
        </Switch>
      </div>
    );
  }
}

export default App;
```

Now run the application and change the URL to http://localhost:3000/members. You will see that the page still shows the `Repos` component. This is because, the relative path /members also matches the path /. To fix this, add the attribute `exact` to the route. The modified route is shown below:

```
<Route path='/' exact component={Repos}>
```

Now you will see the `Members` component on the page when the URL is changed to http://localhost:3000/members.

### Adding Links
It would be great to have links to switch between these views. Links to the react routes can be generated using the `Link` component of React router. It can be imported in the same way as the `Route` component and can be used as shown below:

```
<Link to='/'>Home</Link>
```

The prop `to` accepts the target path. The links will be added to a left menu in the file `App.js`. To show the menu, view of the file `App.js` has to be changed to show the menu and the content. Change contents of the file `App.js` as shown below:

```
import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Repos } from './Repos';
import { Members } from './Members';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Explore the Facebook org on GitHub</h1>
        </header>
        <section className="content">
          <div className="container row">
            <div className="col-md-3">
              <nav className="navbar">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link" to='/repos'>Repos</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to='/members'>Members</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="col-md-9">
              <Switch>
                <Route path="/" exact component={Repos} />
                <Route path="/members" component={Members} />
              </Switch>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
```

Now you will see the menu and the content of the route rendered. You can switch between the two routes using the links. The following screenshot shows the way the page looks now:

[Figure 3]

### Passing Parameter
It would be good to create a page to show the details of a member. This page will be made reachable through the member list page and will display some basic details of the member along with the list of repos the member has in his GitHub account. The members list page will have links to the details pages of the corresponding members and the links will pass login id of the member to the details page. The details page would use the login id to query the GitHub API to get the details of the member and the list of repos the member has.

Add a new file to the `src` folder and name it `MemberDetails.js`. Add the following code to it:

```
import React, { Component } from 'react';
import { githubDataProvider } from './githubData';

export class MemberDetails extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <div>We will see details of the user {this.props.match.params.login} here shortly...</div>;
	}
}
```

The parameter passed to the route would be made available to the component as part of its `props`. Notice the `div` element returned from the `render` method, it binds the parameter it accepted using `this.props.match.params.login`. Here name of the parameter is `login`. The same name has to be used while configuring the route. Let's define the route to load this component now. Open the file `App.js` and add the following import statement:

```
import { MemberDetails } from './MemberDetails';
```

Modify the `Switch` component as shown below:

```
<Switch>
  <Route  path="/repos"  component={Repos}  />
  <Route  path="/members"  component={Members}  />
  <Route  path="/member/:login"  component={MemberDetails}  />
</Switch>
```

Now if you run the application and change the URL to http://localhost:3000/member/aaronabramov, you will see the following page:

[Figure 4]

To add links to the details pages from the members list page, we need to import the `Link` component and pass the login id of the user. Open the file `Members.js` and add the following JSX after the two anchor tags in the `membersjsx` variable:

```
<br  />
<Link  to={`/member/${member.login}`}>View Details</Link>
``` 

On running the application now, you will see the links to the details page rendered in the members page and on clicking any of these links, you will reach the member details page.

Now that we are able to get the login of the user in the member details page, let's use it to fetch the required data and bind it. Open the file `githubData.js` file and add the following method in the class:

```
getMemberDetails(memberLogin) {
	let userRequest = new Request(`${this.userBaseUrl}${memberLogin}`, { headers: this.headers });
	let userReposRequest = new Request(`${this.userBaseUrl}${memberLogin}/repos`, { headers: this.headers });

	return Promise.all([fetch(userRequest),
	fetch(userReposRequest)])
		.then(([member, repos]) => {
			return Promise.all([member.json(), repos.json()]);
		})
		.then(([memberValue, reposValue]) => {
			return {
				member: memberValue,
				repos: reposValue
			};
		});
}
```

The last thing to do is, make the `MemberDetails.js` file functional. Open this file and replace the code in this file with the following:

```
import React, { Component } from 'react';
import { githubDataSvc } from './githubData';

export class MemberDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			details: null
		};
	}

	get Login() {
		return this.props.match.params.login;
	}

	componentDidMount() {
		githubDataSvc.getMemberDetails(this.Login)
			.then(({ member, repos }) => {
				let reposJsx = repos.map(repo => {
					let link = repo.homepage ? <a href={repo.homepage} target='_blank'>Home Page</a> : <span>-</span>;
					return <tr key={repo.id}>
						<td> {repo.name} </td>
						<td>	{repo.stargazers_count}	</td>
						<td>	{repo.watchers_count}	</td>
						<td>	{repo.forks_count}	</td>
						<td>	{repo.open_issues_count}	</td>
						<td>
							{link}
						</td>
					</tr>
				});

				let jsx = <div className='row'>
					<div className='col-md-6'>
						<div className="row">
							<div className='col-md-6'>Name: </div><div className='col-md-6'>{member.name}</div>
							<div className='col-md-6'>Company: </div><div className='col-md-6'>{member.company}</div>
							<div className='col-md-6'>Number of Repos: </div><div className='col-md-6'>{member.public_repos}</div>
							<div className='col-md-6'>Number of Followers: </div><div className='col-md-6'>{member.followers}</div>
							<div className='col-md-6'>Following Count: </div><div className='col-md-6'>{member.following}</div>
						</div>
					</div>
					<div className='col-md-6'>
						<img src={member.avatar_url} alt={`${member.name}'s pic`} height="150" width='150' />
					</div>
					<h4>{member.name}'s Repos</h4>
					<table className="table">
						<thead>
							<tr>
								<th> Name </th>
								<th> Stars </th>
								<th> Watches </th>
								<th> Forks </th>
								<th> Issues </th>
								<th> Home Page </th>
							</tr>
						</thead>
						<tbody>
							{reposJsx}
						</tbody>
					</table>
				</div>;
				this.setState({ details: jsx });
			});
	}

	render() {
		return <div>
			{this.state.details}
		</div>;
	}
}
```

Now you will see the following page in the browser when you visit the URL http://localhost:3000/member/aaronabramov:

[Figure 5]

## Conclusion
React router DOM provides a simple yet powerful way to create routes ans use them in the browser based React applications. As we saw, routes can be added to the React applications is very quickly. We will explore more features of the router in the next article.