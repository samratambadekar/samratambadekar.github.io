$(function(){
	var $write = $('#search_field'),
		shift = false,
		capslock = false;

	$('#keyboard li').click(function(){
		var $this = $(this),
			character = $this.html(); // If it's a lowercase letter, nothing happens to this variable

		// Shift keys
		if ($this.hasClass('left-shift') || $this.hasClass('right-shift')) {
			$('.letter span').toggle();

			shift = (shift === true) ? false : true;
			capslock = false;
			return false;
		}
		// Caps lock
		if ($this.hasClass('capslock')) {
			$('.letter').toggleClass('uppercase');
			capslock = true;
			return false;
		}

		// Delete
		if ($this.hasClass('delete')) {
			var html = $write.html();

			$write.html(html.substr(0, html.length - 1));
			return false;
		}

		// Special characters
		if ($this.hasClass('letter')) character = $('span:visible', $this).html();
		if ($this.hasClass('space')) character = ' ';
		if ($this.hasClass('tab')) character = "\t";
		if ($this.hasClass('return')) character = "";
		//if ($this.hasClass('findonmap')) showMap(), character = '';
		if ($this.hasClass('findonmap')) character = '';

		// Uppercase letter
		if ($this.hasClass('uppercase')) character = character.toUpperCase();

		// Remove shift once a key is clicked.
		if (shift === true) {
			$('.symbol span').toggle();
			if (capslock === false) $('.letter').toggleClass('uppercase');

			shift = false;
		}

		// Add the character
		$write.html($write.html() + character);

		var CampusPlaces = [
            "Campus Recreation Center",
			"1033 Tumlin Street",
			"JS Coon Building",
             "Klaus Advanced Computing"
        ];
        $( "#search_field" ).autocomplete({
            source: CampusPlaces,
			minLength: 2,
        });
		$("#search_field").autocomplete( "search" );


	});
});

$(function() {

  });