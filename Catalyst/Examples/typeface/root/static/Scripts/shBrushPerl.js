dp.sh.Brushes.Perl = function()
{
	var funcs	=	'abs acos acosh addcslashes addslashes rmtree';

	var keywords =	'and or xor __FILE__ __LINE__ array as break case @_ shift ' +
					'sub continue break default die do else ' +
					'elsif empty ' +
					'extends for foreach use include if ' +
					'new return switch package my ' +
					'var while __FUNCTION__ __CLASS__ __PACKAGE__ ' +
					'__METHOD__ abstract interface public implements extends private protected throw';
//new RegExp('#.*$', 'gm'),
	this.regexList = [
		{ regex: dp.sh.RegexLib.SingleLinePerlComments,		        css: 'comment' },			// one line comments
		{ regex: dp.sh.RegexLib.MultiLineCComments,					css: 'comment' },			// multiline comments
		{ regex: dp.sh.RegexLib.DoubleQuotedString,					css: 'string' },			// double quoted strings
		{ regex: dp.sh.RegexLib.SingleQuotedString,					css: 'string' },			// single quoted strings
		{ regex: new RegExp('\\$\\w+', 'g'),						css: 'vars' },				// variables
		{ regex: new RegExp(this.GetKeywords(funcs), 'gmi'),		css: 'func' },				// functions
		{ regex: new RegExp(this.GetKeywords(keywords), 'gm'),		css: 'keyword' }			// keyword
		];

	this.CssClass = 'dp-c';
}

dp.sh.Brushes.Perl.prototype	= new dp.sh.Highlighter();
dp.sh.Brushes.Perl.Aliases	= ['perl'];
