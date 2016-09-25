module.exports = {

	/**
	 * Splits list items in comma-separated lists
	 * @param  {string} val comma-separated list
	 * @return {array}      list items
	 */
	list: function(val) {
		return val.split(',');
	}

};
