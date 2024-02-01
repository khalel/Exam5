using api.Contracts.Request;
using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories
{
    public interface IClientRepository
    {
        Task<IEnumerable<Client>> Get(GetClientsRequest filter);
        Task<Client> GetById(string id);
        Task Create(Client client);
        Task Update(Client client);
        Task Delete(Client client);
        bool ClientExists(string id);
    }

    public class ClientRepository : IClientRepository
    {
        private readonly DataContext _context;

        public ClientRepository(DataContext dataContext)
        {
            _context = dataContext;
        }

        public async Task<IEnumerable<Client>> Get(GetClientsRequest filter)
        {
            if (filter is not null && !string.IsNullOrEmpty(filter.Name))
            {
                return await _context.Clients
                    .Where(p => (p.FirstName + " " + p.LastName).ToLower().Contains(filter.Name))
                    .ToListAsync();
            }
            return await _context.Clients.ToListAsync();
        }

        public async Task<Client> GetById(string id)
        {
            return await _context.Clients.FindAsync(id);
        }

        public async Task Create(Client client)
        {
            await _context.AddAsync(client);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Client client)
        {
            _context.Entry(client).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Client client)
        {
            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();
        }

        public bool ClientExists(string id)
        {
            return (_context.Clients?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}

