using YamlDotNet.RepresentationModel;

namespace EngineIQ.API.Validation;

/// <summary>Minimal schema for tenant standards YAML (extensible for Phase 5).</summary>
public sealed class StandardsConfigYamlValidator
{
    public (bool Valid, IReadOnlyList<string> Errors) Validate(string yaml)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(yaml))
        {
            errors.Add("yaml_empty");
            return (false, errors);
        }

        try
        {
            using var reader = new StringReader(yaml);
            var stream = new YamlStream();
            stream.Load(reader);
            var root = stream.Documents[0].RootNode as YamlMappingNode;
            if (root is null)
            {
                errors.Add("root_must_be_mapping");
                return (false, errors);
            }

            if (!root.Children.TryGetValue(new YamlScalarNode("version"), out var versionNode)
                || versionNode is not YamlScalarNode versionScalar)
            {
                errors.Add("version_required");
            }
            else if (!int.TryParse(versionScalar.Value, out var v) || v != 1)
                errors.Add("version_must_be_1");

            if (root.Children.TryGetValue(new YamlScalarNode("rules"), out var rulesNode))
            {
                if (rulesNode is not YamlSequenceNode seq)
                    errors.Add("rules_must_be_sequence");
                else
                {
                    var index = 0;
                    foreach (var entry in seq.Children)
                    {
                        if (entry is not YamlMappingNode rule)
                        {
                            errors.Add($"rules[{index}]_must_be_mapping");
                            index++;
                            continue;
                        }

                        if (!rule.Children.TryGetValue(new YamlScalarNode("id"), out var idNode)
                            || idNode is not YamlScalarNode idScalar
                            || string.IsNullOrWhiteSpace(idScalar.Value))
                            errors.Add($"rules[{index}].id_required");

                        if (rule.Children.TryGetValue(new YamlScalarNode("severity"), out var sevNode))
                        {
                            if (sevNode is not YamlScalarNode sevScalar)
                                errors.Add($"rules[{index}].severity_invalid");
                            else
                            {
                                var s = (sevScalar.Value ?? string.Empty).Trim().ToLowerInvariant();
                                if (s is not ("error" or "warn" or "warning" or "info"))
                                    errors.Add($"rules[{index}].severity_invalid_value");
                            }
                        }

                        index++;
                    }
                }
            }

            return (errors.Count == 0, errors);
        }
        catch (Exception ex)
        {
            errors.Add($"yaml_parse_error: {ex.Message}");
            return (false, errors);
        }
    }
}
