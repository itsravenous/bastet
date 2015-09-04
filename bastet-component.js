/**
 * @file Bastet component class
 * @author Tom Jenkins tom@itsravenous.com
 */

BastetEntity = require('./bastet-entity');

class BastetComponent extends BastetEntity {
	
	constructor(options) {
		this.outdir = projectDir+'/src/components/'+options.id;
		this.outfile = options.id;
		this.template = bastetDir+'/bastet-templates/component.jade.hbs';
		this.styles = bastetDir+'/bastet-templates/component.scss.hbs';
		this.js = options.js ? bastetDir+'/bastet-templates/component.js.hbs' : false;
		this.partial = true;
	}

}