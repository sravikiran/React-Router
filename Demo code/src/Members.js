import React, { Component } from 'react';
import { githubDataProvider } from './githubData';

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
