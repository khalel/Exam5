export const store: IStore = {
	entities: {
		'xx-aa-bb1': {
			id: 'xx-aa-bb1',
			firstName: 'John',
			lastName: 'Smitherin',
			email: 'johnsmitherin@gmail.com',
			phoneNumber: '+6192099101',
		},
		'xx-aa-bb2': {
			id: 'xx-aa-bb2',
			firstName: 'John',
			lastName: 'Stevens',
			email: 'johnstevens@gmail.com',
			phoneNumber: '+6192099102',
		},
		'xx-aa-bb3': {
			id: 'xx-aa-bb3',
			firstName: 'Steven',
			lastName: 'Smith',
			email: 'stevensmith@gmail.com',
			phoneNumber: '+6192099103',
		},
	},
};

export const addClient = (client: IClient) => {
	store.entities[client.id] = client;
};

export const updateClient = (client: IClient) => {
	store.entities[client.id] = client;
};

export const removeClient = (id: string) => {
	delete store.entities[id];
};

export const listClients = () => {
	const list = Object.keys(store.entities).map((id) => store.entities[id]);

	return list.sort((a, b) => {
		if (a.firstName < b.firstName) {
			return -1;
		}
		if (a.firstName > b.firstName) {
			return 1;
		}
		return 0;
	});
};
