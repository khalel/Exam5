using api.Data;
using api.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

// Add services to the container.

// API Controllers
services.AddControllers(options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true);

// Cors
AddCors();

// Injections
SetInjections();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
services.AddEndpointsApiExplorer();
services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

/* REMOVED SINCE WE CAN USE AN ACTUAL CONTROLLER */
//app.MapGet("/clients", async (IClientRepository clientRepository) =>
//{
//    return await clientRepository.Get();
//})
//.WithName("get clients");

// Seed Data
SeedData();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();

void AddCors()
{
    services.AddCors(options =>
    {
        options.AddDefaultPolicy(builder => builder
            .SetIsOriginAllowedToAllowWildcardSubdomains()
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .Build());
    });
}

void SetInjections()
{
    services.AddDbContext<DataContext>(options => options.UseInMemoryDatabase(databaseName: "Test"));

    services.AddScoped<DataSeeder>();
    services.AddScoped<IClientRepository, ClientRepository>();
    services.AddScoped<IEmailRepository, EmailRepository>();
    services.AddScoped<IDocumentRepository, DocumentRepository>();
}

void SeedData()
{
    using (var scope = app.Services.CreateScope())
    {
        var dataSeeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();

        dataSeeder.Seed();
    }
}