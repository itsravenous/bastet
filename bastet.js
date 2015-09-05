#!/usr/bin/env node

/**
 * @file Allows creating components, templates and pages (template instances)
 * @author Tom Jenkins tom@itsravenous.com
 */

var argv = require('yargs').argv;
var fs = require('fs-extra');
var Handlebars = require('handlebars');
var mkdirp = require('mkdirp').sync;
var chalk = require('chalk');

var action  = argv._[0]; // Currently always "create"
var item  = argv._[1];

var outdir;
var outfile;
var template;
var partial;
var js = false;

var projectDir = process.cwd();
var bastetDir = __dirname;

if (item == 'component') {

	if (!argv.id) argv.id = argv._[2];
	if (!argv.name) argv.name = argv._[3];

	outdir = projectDir+'/src/components/'+argv.id;
	outfile = argv.id;
	template = bastetDir+'/bastet-templates/component.jade.hbs';
	styles = bastetDir+'/bastet-templates/component.scss.hbs';
	partial = true;
	js = argv.js ? bastetDir+'/bastet-templates/component.js.hbs' : false;
	
} else if (item == 'template') {

	if (!argv.id) argv.id = argv._[2];
	if (!argv.name) argv.name = argv._[3];

	outdir = projectDir+'/src/templates/'+argv.id;
	outfile = argv.id;
	template = bastetDir+'/bastet-templates/template.jade.hbs';
	styles = bastetDir+'/bastet-templates/template.scss.hbs';
	partial = true;

} else if (item == 'page') {

	// Validate options
	if (!argv.template) {
		console.log('No template specified. Usage: bastet create page --template template_name --id page_id --title "Page Title"');
		process.exit();
	}
	if (!argv.id) {
		console.log('No id specified. Usage: bastet create page --template template_name --id page_id --title "Page Title"');
		process.exit();
	}
	if (!argv.title) {
		console.log('No title specified. Usage: bastet create page --template template_name --id page_id --title "Page Title"');
		process.exit();
	}

	outdir = projectDir+'/src/pages/'+argv.id;
	outfile = argv.id;	template = bastetDir+'/bastet-templates/page.jade.hbs';
	styles = bastetDir+'/bastet-templates/page.scss.hbs';
	partial = false;

} else if (argv.help || argv.h){
	console.log('\n');
	console.log(chalk.white.underline.bold('You asked for some help:'));
	console.log('Create a component with: ' + chalk.white('bastet create component --id god_avatar --name "God Avatar"'));
	console.log('Create a component with: ' + chalk.white('bastet create template --id god_profile --name "God profile template"'));
	console.log('Create a component with: ' + chalk.white('bastet create page --template god_profile --id ra --title "Ra\'s profile page"'));
	process.exit();
} else if (item != 'site') {
	console.log('Unknown item type. If you need help try adding --help || -h, exiting...');
	process.exit();
} 

if (item == 'component' || item == 'template' || item == 'page') {
	// Ensure directory structure is present
	if (fs.existsSync(outdir)) {
		throw new Error('Item with same name already exists, exiting...');
	}
	mkdirp(outdir);

	// Generate component jade from template
	var jadeTemplate = Handlebars.compile(fs.readFileSync(template).toString());
	var jadeSource = jadeTemplate(argv);

	// Write component jade to dir
	var jadePrefix = partial ? '_' : '';
	fs.writeFileSync(outdir+'/'+jadePrefix+outfile+'.jade', jadeSource);

	// Generate component styles from template
	var styleTemplate = Handlebars.compile(fs.readFileSync(styles).toString());
	var styleSource = styleTemplate(argv);
	fs.writeFileSync(outdir+'/_'+outfile+'.scss', styleSource);

	// Generate JS if required (components only)
	if (js) {
		var jsTemplate = Handlebars.compile(fs.readFileSync(js).toString());
		var jsSource = jsTemplate(argv);
		fs.writeFileSync(outdir+'/'+outfile+'.js', jsSource);
	}
} else if (item == 'site') {
	// If dirname supplied, create instead of using current dir
	if (argv._[2]) {
		projectDir = argv._[2];
		mkdirp(projectDir);
	}

	// Write package.json
	var packageTemplate = Handlebars.compile(fs.readFileSync(bastetDir+'/bastet-templates/package.json').toString());
	var packageSource = packageTemplate(argv);
	fs.writeFileSync(projectDir+'/package.json', packageSource);

	// Write readme
	var readmeTemplate = Handlebars.compile(fs.readFileSync(bastetDir+'/bastet-templates/README.md').toString());
	var readmeSource = readmeTemplate(argv);
	fs.writeFileSync(projectDir+'/README.md', readmeSource);

	// Copy gulpfile
	fs.copySync(bastetDir+'/bastet-templates/gulpfile.js', projectDir+'/gulpfile.js');

	// Copy main sass file
	fs.copySync(bastetDir+'/bastet-templates/main.scss', projectDir+'/src/styles/main.scss');

	// Copy main js file
	fs.copySync(bastetDir+'/bastet-templates/main.js', projectDir+'/src/js/main.js');
}