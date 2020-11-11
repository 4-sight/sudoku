const fs = require("fs")
const YAML = require("json-to-pretty-yaml")
const isJSON = require("is-valid-json")

exports.generateNetlifyConfig = (
  config,
  path = "./static/admin/config.yml"
) => {
  if (isJSON(config)) {
    const data = YAML.stringify(config)
    fs.writeFile(path, data, err => {
      if (err) console.error("Error parsing json to yml", err)
      else {
        console.info("Netlify-cms config.yml created")
      }
    })
  } else {
    console.error("Error parsing netlify cms config, file is not valid JSON")
  }
}
