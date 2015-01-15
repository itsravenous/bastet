#!/usr/bin/env node

/**
 * @file Allows creating components, templates and pages (template instances)
 * @author Tom Jenkins tom@itsravenous.com
 */

var argv = require('yargs').argv;
var fs = require('fs');
var Handlebars = require('handlebars');
var mkdirp = require('mkdirp').sync;

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

	outdir = projectDir+'/src/components/'+argv.id;
	outfile = argv.id;
	template = bastetDir+'/bastet-templates/component.jade.hbs';
	styles = bastetDir+'/bastet-templates/component.scss.hbs';
	partial = true;
	js = argv.js ? bastetDir+'/bastet-templates/component.js.hbs' : false;
	
} else if (item == 'template') {

	outdir = projectDir+'/src/templates/'+argv.id;
	outfile = argv.id;
	template = bastetDir+'/bastet-templates/template.jade.hbs';
	styles = bastetDir+'/bastet-templates/template.scss.hbs';
	partial = true;

} else if (item == 'page') {

	outdir = projectDir+'/src/pages/'+argv.id;
	outfile = argv.id;	template = bastetDir+'/bastet-templates/page.jade.hbs';
	styles = bastetDir+'/bastet-templates/page.scss.hbs';
	partial = false;

} else {
	console.log('Unknown item type, exiting...');
	process.exit();
}

// Ensure directory structure is present
if (fs.existsSync(outdir)) {
	console.log('Item with same name already exists, exiting...');
	process.exit();
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