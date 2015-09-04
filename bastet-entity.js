/**
 * @file Bastet Entity base class
 * @author Tom Jenkins tom@itsravenous.com
 */

class BastetEntity {
	
	scaffold() {
		// Ensure directory structure is present
		if (fs.existsSync(this.outdir)) {
			throw new Error('Item with same name already exists, exiting...');
		}
		mkdirp(this.outdir);

		// Generate component jade from template
		var jadeTemplate = Handlebars.compile(fs.readFileSync(this.template).toString());
		var jadeSource = jadeTemplate(this.options);

		// Write component jade to dir
		var jadePrefix = this.partial ? '_' : '';
		fs.writeFileSync(this.outdir+'/'+jadePrefix+this.outfile+'.jade', jadeSource);

		// Generate component styles from template
		var styleTemplate = Handlebars.compile(fs.readFileSync(this.styles).toString());
		var styleSource = styleTemplate(this.options);
		fs.writeFileSync(this.outdir+'/_'+this.outfile+'.scss', styleSource);

		// Generate JS if required (components only)
		if (js) {
			var jsTemplate = Handlebars.compile(fs.readFileSync(js).toString());
			var jsSource = jsTemplate(this.options);
			fs.writeFileSync(this.outdir+'/'+this.outfile+'.js', jsSource);
		}
	}

}