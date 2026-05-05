using EngineIQ.Admin.Middleware;
using EngineIQ.Admin.Options;
using EngineIQ.Admin.Services;
using EngineIQ.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<AdminAuthOptions>(builder.Configuration.GetSection(AdminAuthOptions.SectionName));
builder.Services.AddEngineIQPersistence(builder.Configuration);
builder.Services.AddRabbitMqJobPublisher(builder.Configuration);

builder.Services.AddSingleton<AdminPortalService>();
builder.Services.AddSingleton<DlqRetryService>();

builder.Services.AddRazorPages();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
    app.UseExceptionHandler("/Error");

app.UseMiddleware<BasicAuthMiddleware>();
app.UseStaticFiles();
app.UseRouting();
app.MapRazorPages();

app.Run();
