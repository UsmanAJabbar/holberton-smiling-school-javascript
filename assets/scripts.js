/**
 * =====================================
 * GLOBAL VARIABLES
 * =====================================
 */

/* Record a copy of all the necessary sections that need their API queried */
let sectionIDs = []

/**
 * =====================================
 * TOOLS
 * =====================================
 */
apiGetter = (end) => {

	/* Returns the necessary callback function to generate that section. */
	let sectionGen = {
		'quotes': getQuotes
		// 'popular-tutorials': getTutorials,
		// 'latest-videos': getVideos,
		// 'courses': getCourses
	}

	$.ajax({
		url: `https://smileschool-api.hbtn.info/${end}`,
		success: (data) => { sectionGen[end](data, end); },
		fail: () => { alert(`The backend is not reachable`); }
	})

}

endPreloader = (section) => {
	/* End the preloader and reveal data */
	$(`#${section} > div.d-none`).removeClass('d-none');
	$(`#${section} > div.loader`).addClass('d-none');
}

sectionsInDOM = () => {
	/**
	 * This ensures that I don't unecessarily query
	 * the ID and only query it for the necessary
	 * sections.
	 */
	$('section').each(function () {
		sectionIDs.push( $(this).attr('id') );
	});
}

/**
 * =====================================
 * CONTENT GENERATOR
 * =====================================
 * DESCRIPTION:
 * 		Functions in here are responsible for
 * generating content for the front end after
 * API getter returns the necessary data
 * returned from the queried API.
 * 
 * ARGUMENTS:
 * 		@api: data returned from the API
 * 		@section: endpoint or section ID.
 */
getQuotes = (api, section) => {

	/* Adds all the data in the class */
	for (const data of api) {
		$(`#${section} .carousel-inner`).append(
			$('<div>', {class: 'carousel-item'}).append(
				$('<div>', {class: 'd-flex flex-wrap flex-md-nowrap align-items-center justify-content-center'}).append(
					$('<div>', {class: 'testimonial_profile_pic m-4'}).append(
						$('<img>', {class: 'rounded-circle', src: data.pic_url})
					),
					$('<div>', {class: 'testimonal_text'}).append(
						$('<blockquote>', {class: 'testimonal_quotes', text: data.text}),
						$('<h4>', {class: 'profile_name m-0', text: data.name}),
						$('<p>', {class: 'profession font-italic', text: data.title})
		))))
	}
	/* Adds active element to the class for the carousel to work */
	$(`#${section} .carousel-item:nth-child(1)`).addClass('active');

	/* If the content has been generated, remove the loader */
	endPreloader(section);
}

$(window).ready( () => {
	/* Find all the sections that need to be generated */
	sectionsInDOM();
	apiGetter('quotes');
})
