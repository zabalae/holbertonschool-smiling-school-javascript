function loadXML(url, callback) {
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'xml',
      success: function (data) {
        callback(data);
      },
      error: function () {
        console.error('Failed to load data from ' + url);
      },
    });
  }
  
  // Function to parse and display courses from XML
  function loadCoursesXML(searchValue = '', topic = 'all', sortBy = 'most_popular') {
    $('#video-results').empty().append('<div class="loader text-center">Loading...</div>');
  
    loadXML(`https://smileschool-api.hbtn.info/xml/courses?q=${searchValue}&topic=${topic}&sort=${sortBy}`, function (xml) {
      $('#video-results').empty();
  
      const courses = $(xml).find('course');
      $('.video-count').text(`${courses.length} videos`);
  
      courses.each(function () {
        const title = $(this).find('title').text();
        const subTitle = $(this).find('sub-title').text();
        const thumbUrl = $(this).find('thumb_url').text();
        const author = $(this).find('author').text();
        const authorPicUrl = $(this).find('author_pic_url').text();
        const star = $(this).find('star').text();
        const duration = $(this).find('duration').text();
  
        const stars = '⭐'.repeat(star).padEnd(5, '☆');
        
        const card = `
          <div class="col-12 col-sm-4 col-lg-3 d-flex justify-content-center">
            <div class="card">
              <img src="${thumbUrl}" class="card-img-top" alt="Video thumbnail" />
              <div class="card-img-overlay text-center">
                <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay" />
              </div>
              <div class="card-body">
                <h5 class="card-title font-weight-bold">${title}</h5>
                <p class="card-text text-muted">${subTitle}</p>
                <div class="creator d-flex align-items-center">
                  <img src="${authorPicUrl}" alt="${author}" width="30px" class="rounded-circle" />
                  <h6 class="pl-3 m-0 main-color">${author}</h6>
                </div>
                <div class="info pt-3 d-flex justify-content-between">
                  <div class="rating">${stars}</div>
                  <span class="main-color">${duration}</span>
                </div>
              </div>
            </div>
          </div>`;
          
        $('#video-results').append(card);
      });
    });
  }
  
  // Function to load dropdowns from XML
  function loadDropdownsXML() {
    loadXML('https://smileschool-api.hbtn.info/xml/courses', function (xml) {
      const topics = $(xml).find('topics').find('topic');
      const sorts = $(xml).find('sorts').find('sort');
  
      topics.each(function () {
        $('#topic-dropdown-menu').append(`<a class="dropdown-item" href="#">${$(this).text()}</a>`);
      });
  
      sorts.each(function () {
        $('#sort-dropdown-menu').append(`<a class="dropdown-item" href="#">${$(this).text()}</a>`);
      });
  
      loadCoursesXML();
    });
  }
  
  $(document).ready(function () {
    // Load dropdowns and initial course data
    loadDropdownsXML();
  
    // Handle search, topic, and sort changes
    $('#search-keywords').on('input', function () {
      const searchValue = $(this).val();
      const topic = $('#dropdown-topic span').text();
      const sortBy = $('#dropdown-sort span').text();
      loadCoursesXML(searchValue, topic, sortBy);
    });
  
    $('#topic-dropdown-menu').on('click', 'a', function () {
      const topic = $(this).text();
      $('#dropdown-topic span').text(topic);
      const searchValue = $('#search-keywords').val();
      const sortBy = $('#dropdown-sort span').text();
      loadCoursesXML(searchValue, topic, sortBy);
    });
  
    $('#sort-dropdown-menu').on('click', 'a', function () {
      const sortBy = $(this).text();
      $('#dropdown-sort span').text(sortBy);
      const searchValue = $('#search-keywords').val();
      const topic = $('#dropdown-topic span').text();
      loadCoursesXML(searchValue, topic, sortBy);
    });
  });
  