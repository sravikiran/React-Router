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