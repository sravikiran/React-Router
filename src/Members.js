import React, { Component } from 'react';
import { githubDataSvc } from './githubData';
import { Link, withRouter } from 'react-router-dom';

export class Members extends Component {
	constructor() {
		super();
		this.state = {
			members: []
		};
	}

	componentDidMount() {
		githubDataSvc.getMembers()
			.then(members => {
				let membersjsx = members.map(member => {
					return <div className='col-md-3 tile' key={member.login}>
						<div className='col-md-8'>
							<img src={member.avatar_url} alt={member.login} className='avatar' />
						</div>
						<div className='col-md-4'>
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
			<h3>Members of the {githubDataSvc.org} organization</h3>
			<div className='row'>
				{this.state.members}
			</div>
		</div>;
	}
}
