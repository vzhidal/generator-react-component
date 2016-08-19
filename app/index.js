var generators = require('yeoman-generator');
var path = require('path');
var changeCase = require('change-case');

module.exports = generators.Base.extend({

    constructor: function () {
        generators.Base.apply(this, arguments);
        this.argument('componentName', { type: String, required: true });
    },

    prompting: function () {
        var self = this;

        var done = self.async();
        var prompt = self.prompt.bind(this);

        prompt({
            type: 'string',
            name: 'destinationPath',
            message: 'Destination Path',
            default: './'
        }, function (value) {
            self.destination = value.destinationPath;

            done();
        });
    },

    writing: function () {
        var self = this;

        var componentNameCamelCase = changeCase.camel(self.componentName);
        var componentNamePascalCase = changeCase.pascal(componentNameCamelCase);
        var componentNameKebabCase = changeCase.paramCase(componentNameCamelCase);
        var destination = self.destination;

        var pathsConfig = [
            {
                templatePath: 'componentScript.ejs',
                destinationPath: path.join(destination, `${componentNameCamelCase}/${componentNameCamelCase}.js`),
                params: {
                    componentNameCamelCase: componentNameCamelCase,
                    componentNamePascalCase: componentNamePascalCase,
                    componentNameKebabCase: componentNameKebabCase
                }
            },
            {
                templatePath: 'componentStyle.ejs',
                destinationPath: path.join(destination, `${componentNameCamelCase}/${componentNameCamelCase}.less`),
                params: {
                    componentNameKebabCase: componentNameKebabCase
                }
            },
            {
                templatePath: 'componentPackage.ejs',
                destinationPath: path.join(destination, `${componentNameCamelCase}/package.json`),
                params: {
                    componentNameCamelCase: componentNameCamelCase,
                    componentNamePascalCase: componentNamePascalCase
                }
            }
        ];

        pathsConfig.forEach(function (config) {
            self.fs.copyTpl(
                self.templatePath(config.templatePath),
                self.destinationPath(config.destinationPath),
                config.params
            );
        });
    }
});
