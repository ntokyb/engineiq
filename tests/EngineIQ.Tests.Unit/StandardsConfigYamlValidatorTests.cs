using EngineIQ.API.Validation;

namespace EngineIQ.Tests.Unit;

public sealed class StandardsConfigYamlValidatorTests
{
    private readonly StandardsConfigYamlValidator _validator = new();

    [Fact]
    public void Valid_minimal_yaml_passes()
    {
        var yaml = "version: 1\n";
        var (valid, errors) = _validator.Validate(yaml);
        Assert.True(valid);
        Assert.Empty(errors);
    }

    [Fact]
    public void Missing_version_fails()
    {
        var yaml = "rules: []\n";
        var (valid, errors) = _validator.Validate(yaml);
        Assert.False(valid);
        Assert.Contains("version_required", errors);
    }

    [Fact]
    public void Rules_with_invalid_severity_fails()
    {
        var yaml = """
            version: 1
            rules:
              - id: test-rule
                severity: loud
            """;
        var (valid, errors) = _validator.Validate(yaml);
        Assert.False(valid);
        Assert.Contains(errors, e => e.Contains("severity", StringComparison.Ordinal));
    }
}
