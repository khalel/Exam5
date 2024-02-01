using api.Contracts.Request;
using api.Data;
using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace api.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IClientRepository _clientRepository;
        private readonly IEmailRepository _emailRepository;
        private readonly IDocumentRepository _documentRepository;

        public ClientsController(DataContext context, IClientRepository clientRepository, IEmailRepository emailRepository, IDocumentRepository documentRepository)
        {
            _context = context;
            _clientRepository = clientRepository;
            _emailRepository = emailRepository;
            _documentRepository = documentRepository;
        }

        // GET: api/Clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients([FromQuery]GetClientsRequest filter)
        {
            if (_context.Clients == null)
            {
                return NotFound();
            }

            var clients = await _clientRepository.Get(filter);

            if (clients.Count() == 0)
            {
                return NotFound();
            }

            return Ok(clients);
        }

        // GET: api/Clients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(string id)
        {
            if (_context.Clients == null)
            {
                return NotFound();
            }

            var client = await _clientRepository.GetById(id);

            if (client == null)
            {
                return NotFound();
            }

            return client;
        }

        // POST: api/Clients
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Client>> PostClient([FromForm]PostClientRequest client)
        {
            if (_context.Clients == null)
            {
                return NotFound();
            }

            var newClient = new Client(Guid.NewGuid().ToString(), client.FirstName, client.LastName, client.Email, client.PhoneNumber);

            try
            {
                await _clientRepository.Create(newClient);
            }
            catch (DbUpdateException)
            {
                if (ClientExists(newClient.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            await DoOtherTasks(newClient);

            return CreatedAtAction("GetClient", new { id = newClient.Id }, newClient);
        }

        // PUT: api/Clients/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutClient([FromForm]PutClientRequest client)
        {
            if (_context.Clients == null || !ClientExists(client.Id))
            {
                return NotFound();
            }

            var clientUpdate = new Client(client.Id, client.FirstName, client.LastName, client.Email, client.PhoneNumber);

            try
            {
                await _clientRepository.Update(clientUpdate);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(clientUpdate.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            await DoOtherTasks(clientUpdate);

            return NoContent();
        }

        // DELETE: api/Clients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(string id)
        {
            if (_context.Clients == null || !ClientExists(id))
            {
                return NotFound();
            }

            var client = await _clientRepository.GetById(id);

            if (client == null)
            {
                return NotFound();
            }

            await _clientRepository.Delete(client);

            return NoContent();
        }

        private bool ClientExists(string id)
        {
            return _clientRepository.ClientExists(id);
        }

        private async Task DoOtherTasks(Client client)
        {
            // use message queuing to replace this
            try
            {
                await _emailRepository.Send(client.Email, "Hi there - welcome to my Carepatron portal.");
                await _documentRepository.SyncDocumentsFromExternalSource(client.Email);
            }
            catch (Exception) { }
        }
    }
}
