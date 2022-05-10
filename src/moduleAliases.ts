import moduleAlias from 'module-alias';

moduleAlias.addAliases({
	'@modules': `${__dirname}/modules`,
	'@schemas': `${__dirname}/database/schemas`,
	'@typings': `${__dirname}/types`,
	'@utils': `${__dirname}/utils`,
	'@commands': `${__dirname}/commands`,
});
