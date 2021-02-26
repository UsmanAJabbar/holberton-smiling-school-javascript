/**
 * This area is responsible for fetching and parsing data
 * returned by all of the api endpoints.
 * 
 * The data retuned by the APIs are then accessible
 * globally.
 **/ 
let api = {};
let endpoints = ['quotes', 'popular-tutorials', 'latest-videos', 'courses'];
apiSetter = () => {
	apiGetter = (data, section) => { api[section] = data; }

	for (const endpoint of endpoints) {
		$.ajax({
			url: `https://smileschool-api.hbtn.info/${endpoint}`,
			success: (data) => { apiGetter(data, endpoint); },
			fail: () => { alert(`The backend is not reachable`); }
		})
	}
}
/**
 * This section adds content to the testimonals/quotes section
 */
function getQuotes() {
	for (const element of api.quotes){
		$('#testimonials .carousel-inner').append(
			$('<div>', {class: 'carousel-item'}).append(
				$('<div>', {class: 'd-flex flex-wrap flex-md-nowrap align-items-center justify-content-center'}).append(
					$('<div>', {class: 'testimonial_profile_pic m-4'}).append(
						$('<img>', {class: 'rounded-circle', src: element.pic_url})
					),
					$('<div>', {class: 'testimonal_text'}).append(
						$('<blockquote>', {class: 'testimonal_quotes', text: element.text}),
						$('<h4>', {class: 'profile_name m-0', text: element.name}),
						$('<p>', {class: 'profession font-italic', text: element.title})
		))))
	}
	$('.carousel-item:nth-child(1)').addClass('active');
}

apiSetter();
getQuotes();
