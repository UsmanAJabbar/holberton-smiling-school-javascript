/**
 * =====================================
 * TOOLS
 * =====================================
 */
apiGetter = (end) => {

	/* Returns the necessary callback function to generate that section. */
	let sectionGen = {
		'quotes': getQuotes,
		'popular-tutorials': getTutorials,
		'latest-videos': getVideos
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
	let sectionIDs = [];
	let sectionGen = {
		'quotes': getQuotes,
		'popular-tutorials': getTutorials,
		'latest-videos': getVideos
		// 'courses': getCourses
	}

	$('section').each( function() {
		if( $(this).attr('id') in sectionGen)
			sectionIDs.push( $(this).attr('id') );
	});
	return sectionIDs;
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
 * FUNCTIONS:
 * 		All of the parent functions take data returned from the API
 * 		as well as the ID of the section that doubles as the initiator
 * 		for the endPreloader() function.
 * 		getQuotes() - generates and returns the cards.
 * 		getTutorials()/getVideos() - Parent function.
 * 			cardGenerator() - Generates the cards.
 * 				starGen() - Generates an array of divs containing stars.
 * 			carouselItemContainerGen() - Since Bootstrap's carousel looks
 * 				for the next carousel-item class, we need to add as many cards
 * 				we could to it to form a row.
 * 			tutorialsInit()/videosInit() - Initiator function that calls on the
 * 				carouselItemContainerGen() function and starts the chain of processing
 * 				for the cards to be generated. Later in the function its used to keep
 * 				track of resizes and called on carouselItemContainerGen() with new
 * 				row sizes if needed based on the device's screen width...
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

getTutorials = (api, section) => {
	cardGenerator = (api, numberOfCards) =>  {

		starGen = (rating) => {

			let arrOfStarDivs = [];
			let numberOfcoloredStars = rating;
			let numberOfgreyStars = 5 - numberOfcoloredStars;
	
			/* Add colored stars to the array */
			for(let i = 0; i < numberOfcoloredStars; i++) {
				arrOfStarDivs.push( $('<div>', {class: 'star accented mx-1'}) );
			}
			/* Add grey stars to the array */
			for(let i = 0; i < numberOfgreyStars; i++) {
				arrOfStarDivs.push( $('<div>', {class: 'star greyed mx-1'}) )
			}
	
			/* Remove uncessary mx-1 and switch our for mr/ml-1 on the first/last star element */
			arrOfStarDivs[0].removeClass('mx-1').addClass('mr-1');
			arrOfStarDivs[4].removeClass('mx-1').addClass('ml-1');
	
			return arrOfStarDivs;
		}

		let arrOfCards = [];

		for (const data of api) {
			arrOfCards.push(
				$('<div>', {class: `card rounded overflow-hidden p-1 border-0 col-${12 / numberOfCards}`}).append(
					$('<div>', {class: 'bg-full video-thumbnail d-flex justify-content-center align-items-center', style: `background-image: url(${data.thumb_url})`}).append(
						$('<div>', {class: 'play_btn'})
					),
					$('<div>', {class: 'card-body'}).append(
						$('<h5>', {class: 'card-title font-weight-bold', text: data.title}),
						$('<p>', {class: 'card-text', text: data['sub-title'] })
					),
					$('<div>', {class: 'card-footer bg-white border-0 p-3'}).append(
						$('<div>', {class: 'd-flex align-items-center'}).append(
							$('<img>', {class: 'rounded-circle mr-2 my-2', width: '50px', src: data.author_pic_url}),
							$('<p>', {class: 'font-weight-bold m-0 accent-primary-txt', text: data.author})
						),
						$('<div>', {class: 'rating_plus_time d-flex justify-content-between'}).append(
							$('<div>', {class: 'rating d-flex'}).append( starGen(data.star) ),
							$('<p>', {class: 'time accent-primary-txt font-weight-bold m-0', text: data.duration})
			)	)	)	)
		}

		return arrOfCards;
	}

	carouselItemContainerGen = (numOfCardsInRow) => {
		let cards = cardGenerator(api, numOfCardsInRow);
		let numCarouselItems = Math.ceil( cards.length / numOfCardsInRow );
		let carouselItems = [];

		let parent = null;

		for(let i = 0; i < numCarouselItems; i++) {
			if (numOfCardsInRow > 1)
				parent = $('<div>', {class: 'carousel-item'}).append( $('<div>', {class: 'row'}) ).children();
			else
				parent = $('<div>', {class: 'carousel-item'});

			for(let j = i * numOfCardsInRow; j < cards.length; j += numOfCardsInRow)
				parent.append( cards.slice(j, j + numOfCardsInRow) );

			carouselItems.push(parent);
		}
		return carouselItems;
	}

	tutorialsInit = () => {

		let offset = 17; /* Locally, it seemed that width() returned width - 17px */
		let screenWidth = $(window).width() + offset;
		if (screenWidth >= 992) {
			$('#video_slider .carousel-inner').empty();
			$('#video_slider .carousel-inner').append( carouselItemContainerGen(4) );
			$('#video_slider .carousel-inner .row').wrap('<div class="carousel-item"></div>')
			$('#video_slider .carousel-inner .carousel-item:nth-child(1)').addClass('active');
			desktop = 1, tablet = 0, mobile = 0;
		}
		else if (screenWidth >= 768) {
			$('#video_slider .carousel-inner').empty();
			$('#video_slider .carousel-inner').append( carouselItemContainerGen(2) );
			$('#video_slider .carousel-inner .row').wrap('<div class="carousel-item"></div>')
			$('#video_slider .carousel-inner .carousel-item:nth-child(1)').addClass('active');
			desktop = 0, tablet = 1, mobile = 0;
		}
		else {
			$('#video_slider .carousel-inner').empty();
			$('#video_slider .carousel-inner').append( carouselItemContainerGen(1) );
			$('#video_slider .carousel-inner .row').removeClass('row').addClass('carousel-item');
			$('#video_slider .carousel-inner .carousel-item:nth-child(1)').addClass('active');
			desktop = 0, tablet = 0, mobile = 1;
		}
		endPreloader(section);
	}

	/* This function would ensure that the cards adapt on resize */
	tutorialsInit();
	$(window).on('resize', tutorialsInit);
}

getVideos = (api, section) => {

	cardGenerator = (api, numberOfCards) =>  {

		starGen = (rating) => {

			let arrOfStarDivs = [];
			let numberOfcoloredStars = rating;
			let numberOfgreyStars = 5 - numberOfcoloredStars;
	
			/* Add colored stars to the array */
			for(let i = 0; i < numberOfcoloredStars; i++) {
				arrOfStarDivs.push( $('<div>', {class: 'star accented mx-1'}) );
			}
			/* Add grey stars to the array */
			for(let i = 0; i < numberOfgreyStars; i++) {
				arrOfStarDivs.push( $('<div>', {class: 'star greyed mx-1'}) )
			}
	
			/* Remove uncessary mx-1 and switch our for mr/ml-1 on the first/last star element */
			arrOfStarDivs[0].removeClass('mx-1').addClass('mr-1');
			arrOfStarDivs[4].removeClass('mx-1').addClass('ml-1');
	
			return arrOfStarDivs;
		}

		let arrOfCards = [];

		for (const data of api) {
			arrOfCards.push(
				$('<div>', {class: `card rounded overflow-hidden p-1 border-0 col-${12 / numberOfCards}`}).append(
					$('<div>', {class: 'bg-full video-thumbnail d-flex justify-content-center align-items-center', style: `background-image: url(${data.thumb_url})`}).append(
						$('<div>', {class: 'play_btn'})
					),
					$('<div>', {class: 'card-body'}).append(
						$('<h5>', {class: 'card-title font-weight-bold', text: data.title}),
						$('<p>', {class: 'card-text', text: data['sub-title'] })
					),
					$('<div>', {class: 'card-footer bg-white border-0 p-3'}).append(
						$('<div>', {class: 'd-flex align-items-center'}).append(
							$('<img>', {class: 'rounded-circle mr-2 my-2', width: '50px', src: data.author_pic_url}),
							$('<p>', {class: 'font-weight-bold m-0 accent-primary-txt', text: data.author})
						),
						$('<div>', {class: 'rating_plus_time d-flex justify-content-between'}).append(
							$('<div>', {class: 'rating d-flex'}).append( starGen(data.star) ),
							$('<p>', {class: 'time accent-primary-txt font-weight-bold m-0', text: data.duration})
			)	)	)	)
		}

		return arrOfCards;
	}

	carouselItemContainerGen = (numOfCardsInRow) => {
		let cards = cardGenerator(api, numOfCardsInRow);
		let numCarouselItems = Math.ceil( cards.length / numOfCardsInRow );
		let carouselItems = [];

		let parent = null;

		for(let i = 0; i < numCarouselItems; i++) {
			if (numOfCardsInRow > 1)
				parent = $('<div>', {class: 'carousel-item'}).append( $('<div>', {class: 'row'}) ).children();
			else
				parent = $('<div>', {class: 'carousel-item'});

			for(let j = i * numOfCardsInRow; j < cards.length; j += numOfCardsInRow)
				parent.append( cards.slice(j, j + numOfCardsInRow) );

			carouselItems.push(parent);
		}
		return carouselItems;
	}

	videosInit = () => {

		let offset = 17; /* Locally, it seemed that width() returned width - 17px */
		let screenWidth = $(window).width() + offset;
		if (screenWidth >= 992) {
			$('#video_slider-2 .carousel-inner').empty();
			$('#video_slider-2 .carousel-inner').append( carouselItemContainerGen(4) );
			$('#video_slider-2 .carousel-inner .row').wrap('<div class="carousel-item"></div>')
			$('#video_slider-2 .carousel-inner .carousel-item:nth-child(1)').addClass('active');
			desktop = 1, tablet = 0, mobile = 0;
		}
		else if (screenWidth >= 768) {
			$('#video_slider-2 .carousel-inner').empty();
			$('#video_slider-2 .carousel-inner').append( carouselItemContainerGen(2) );
			$('#video_slider-2 .carousel-inner .row').wrap('<div class="carousel-item"></div>')
			$('#video_slider-2 .carousel-inner .carousel-item:nth-child(1)').addClass('active');
			desktop = 0, tablet = 1, mobile = 0;
		}
		else {
			$('#video_slider-2 .carousel-inner').empty();
			$('#video_slider-2 .carousel-inner').append( carouselItemContainerGen(1) );
			$('#video_slider-2 .carousel-inner .row').removeClass('row').addClass('carousel-item');
			$('#video_slider-2 .carousel-inner .carousel-item:nth-child(1)').addClass('active');
			desktop = 0, tablet = 0, mobile = 1;
		}
		endPreloader(section);
	}

	/* This function would ensure that the cards adapt on resize */
	videosInit();
	$(window).on('resize', videosInit);
}

$(window).ready( () => {
	let sectionInDOM = sectionsInDOM();

	for (section of sectionInDOM)
		apiGetter(section);
});
