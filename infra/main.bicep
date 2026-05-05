// EngineIQ — Azure infrastructure (South Africa North for POPIA)
// Minimal scaffold for Milestone 0; expand in M1+ (Service Bus, PostgreSQL, Redis, etc.)

targetScope = 'resourceGroup'

@description('Base name for resources')
param baseName string = 'engiq'

@description('Azure region (use southafricanorth for POPIA)')
param location string = resourceGroup().location

// Placeholder: add Key Vault, Container Apps, etc. in M1
// For M0, run API locally with user secrets or env vars

var tags = {
  Application: 'EngineIQ'
  Environment: 'dev'
}

output location string = location
output baseName string = baseName
