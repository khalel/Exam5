import apiClient from "./apiClient";

export const getClients = (): Promise<IClient[]> => {
  return apiClient.get<IClient[]>("clients");
};

export const createClient = (client: IClient): Promise<void> => {
  return apiClient.post<void>("clients", client);
};

export const updateClient = (client: IClient): Promise<void> => {
  return apiClient.put<void>("clients", client);
};

export const getFilteredClients = (filter: string): Promise<IClient[]> => {
  const q = apiClient.get<IClient[]>("clients");
  
  if (filter === "")
  {
    return q.then();
  }
  else 
  {
    return q.then((clients) =>
      clients = clients.filter((row) => {
        return `${row.firstName} ${row.lastName}`.toLowerCase().includes(filter.toLowerCase());
      })
    );
  }
};
