using EngineIQ.Infrastructure;
using EngineIQ.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddEngineIQPersistence(builder.Configuration);

using var host = builder.Build();

var factory = host.Services.GetRequiredService<IDbContextFactory<EngineIQDbContext>>();
await using var db = await factory.CreateDbContextAsync();
await db.Database.MigrateAsync();

Console.WriteLine("Migrations applied successfully.");
return 0;
