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

	getMembers(orgName) {
		let request = new Request(`${this.orgBaseUrl}${this.org}/members`, { headers: this.headers });
	
		return fetch(request).then((res) => {
			return res.json()
				.then(members => {
					return members;
				});
		});
	}
}

export let githubDataProvider = new GithubData();