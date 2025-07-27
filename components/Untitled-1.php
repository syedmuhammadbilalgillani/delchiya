<?php
	add_action( 'wp_enqueue_scripts', 'cozystay_child_enqueue_scripts' );
	function cozystay_child_enqueue_scripts(){
		wp_enqueue_style( 'cozystay-child-theme-style', get_stylesheet_uri(), array( 'cozystay-theme-style' ) );
	}

	add_filter( 'cozystay_front_inline_styles_handler', 'cozystay_child_inline_style_handler', 999 );
	function cozystay_child_inline_style_handler( $handler ) {
		return 'cozystay-child-theme-style';
	}
    function enqueue_custom_js() {
        wp_enqueue_script('custom-js', get_stylesheet_directory_uri() . '/assets/custom.js', array('jquery'), rand(111111,999999), true);
    }
add_action('wp_enqueue_scripts', 'enqueue_custom_js');
function trigger_curl_request_on_front_page() {
    // Check if on front page and debug parameter is set
    if (!is_admin()) {
        // Send cURL request to API
        $response = wp_remote_get(
            // 'https://delchiya.de/api/availability.json'
            'https://api.villavilla.com/partner-api/v1/houses/122/availability?currency_code=208',
            [
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901'
                ]
            ]
        );

        if (is_wp_error($response)) {
            // Handle error, log, etc.
            $error_message = $response->get_error_message();
            // echo "Error: $error_message";
        } else {
            $today = date('Y-m-d');
            $tomorrow = date('Y-m-d', strtotime('+1 day'));
            $api_url = 'https://api.villavilla.com/partner-api/v1/period?house_id=122&arrival='.$today.'&departure='.$tomorrow.'&currency_code=208';
            // Echo the API URL for debugging
            // echo $api_url;

            $response2 = wp_remote_get(
                'https://api.villavilla.com/partner-api/v1/period?house_id=122&arrival='.$today.'&departure='.$tomorrow.'&currency_code=208',
                [
                    'headers' => [
                        'Accept' => 'application/json',
                        'Content-Type' => 'application/json',
                        'Authorization' => 'Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901'
                    ]
                ]
            );
            if (is_wp_error($response2)) {
                $error_message2 = $response2->get_error_message();
                echo json_encode(['error' => $error_message2]); // Return error message as JSON
            } else {
                $body2 = wp_remote_retrieve_body($response2);
                $data2 = json_decode($body2, true);
                $noroom = isset($data2["errors"]) ? 1 : 0;
                if($noroom==1){
                    $data2='';
                }
                    // echo $noroom;
                    // if()
                    $body = wp_remote_retrieve_body($response);
                    // $jsonUrl = 'https://delchiya.de/api/availability.json';

                    // Get the JSON data from the URL
                    // $jsonData = file_get_contents($jsonUrl);
                
                    
                    // Decode the JSON data into a PHP array
                    // $data = json_decode($jsonData, true);
                    
                    $data = json_decode($body, true);
                    // Pass availability data to the footer script
                    add_action('wp_footer', function() use ($noroom,$data,$data2) {
                        ?>
                        <script>
                            jQuery(document).ready(function($) {
                                
                                var counterVar = 1;
                                var startingDates = [];
                                var availabilityData = <?php echo json_encode($data); ?>;
                                // alert( availabilityData );
                               // // console.log( availabilityData );
                                
                                var noroom = <?php echo json_encode($noroom); ?>;
                               // // console.log("noroom");
                                var availabilityData2=false;
                                if (noroom === 0) {
                                   // // console.log(noroom);
                                    
                                    var availabilityData2 = <?php echo json_encode($data2); ?>;
                                   // // console.log(availabilityData2)
                                    // Additional logic when there are available rooms
                                }else{
                                    var noroom=1;
                                }
                               // // console.log(noroom);
                               // // console.log("all_data");
                                //   $('.elementor-element-6193371b .check-in-date').addClass('check-in-out-date');
                                //   $('.elementor-element-6193371b .check-out-date').addClass('check-in-out-date');
                                //   $('.check-in-out-date').removeClass('check-in-date');
                                //   $('.check-in-out-date').removeClass('check-out-date');
                                //   $('.date-range-picker').remove();
                                $('.date-range-picker').daterangepicker({
                                    // alert("working");
                                    
                                    autoUpdateInput: false, // Disable auto update input field
                                    locale: {
                                        format: 'YYYY-MM-DD', // Define the desired date format
                                        // You can customize other locale options here
                                    },
                                    // onSelect: function(start, end) {
                                    //     alert("works");
                                    // },
                                    beforeShowDay: function(date) {

                                        if (counterVar == 1) {
                                            jQuery("div.drp-buttons").append(
                                                "<div class='dateBoxes'><div class='startDateBox'></div><span>Start Date</span><div class='endDateBox'></div><span>Start & end Date</span><div class='endingDateBox'></div><span>End Date</span></div>"
                                            );
                                            counterVar++;
                                        }
                                    
                                        var dateString = moment(date).format('YYYY-MM-DD');
                                        var available = false;
                                        var price = 0;
                                        var rangeClasses = "";
                                        var betweenRange = "";
                                        var rangeStartDate = "";
                                        var inCalender = false;
                                    
                                        // Check if the date is within any of the availability periods
                                        for (var i = 0; i < availabilityData.length; i++) {
                                            var period = availabilityData[i].period;
                                    
                                            rangeClasses = "available";
                                            price = availabilityData[i].pricing.rent;
                                            
                                            if (dateString === period.from) {
                                                var checkDate = startingDates.includes(dateString);
                                                
                                                if (checkDate) {
                                                    betweenRange = 'startAndStartDate';
                                                } else {
                                                    betweenRange = 'startingDate';
                                                }
                                                available = true; // Date is available
                                                
                                            } 
                                            
                                            if (dateString === period.to) {
                                                startingDates.push(dateString);
                                                betweenRange = 'endingDate';
                                                available = true; // Date is available
                                            }
                                            
                                            // Add the betweenRangeDate class for dates between period.from and period.to
                                            if (dateString > period.from && dateString < period.to) {
                                                betweenRange = 'betweenRangeDate';
                                                // available = true; // Date is available
                                            }
                                        }
                                        
                                        if (!inCalender) {
                                            // betweenRange = betweenRange + " bookedDates";
                                        }
                                        
                                        // Return an array: [available, cssClass, tooltip]
                                        if (available) {
                                            return [true, betweenRange, 'Available. Price: ' + price];
                                        } else {
                                            return [false, betweenRange + 'unavailable booked', 'Not available.'];
                                        }
                                    }
                                }, function(startDate , endDate, label) {
                                   // // console.log("start");
        
                                    ////   console.log("daterangepicker2")
                                      var totalPrice = 0;
                                      var totalCleaning = 0;
                                       $(".button.applyBtn.btn.btn-sm.btn-primary").click();
                                        var startDateString = startDate.format('YYYY-MM-DD');
                                        var endDateString = endDate.format('YYYY-MM-DD');
                                        // CODE BY Faisal Ali (faisal.supple@gmail.com)
                                        var nextDateAvailable = true;
                                        let areAvailables = [];
        
                                        var nextDate = moment(startDate).add(1, 'days').format('YYYY-MM-DD');
        
                                        for (var i = 0; i < availabilityData.length; i++) {
        
                                            var period = availabilityData[i].period;
                                           // // console.log( period );
                                           
        
                                            if (nextDate >= period.from && nextDate <= period.to) {
                                                // alert("testing");
                                                nextDateAvailable = true; 
                                                areAvailables.push(availabilityData[i])
                                                break;
                                            } 
                                        }
                                        ////  console.log(areAvailables)
                                        ////  console.log("f1")
        
                                        ////  console.log(startDateString, endDateString)
                                        const _startDate = new Date(areAvailables[0].period.from);
                                        const _endDate = new Date(areAvailables[0].period.to);
        
                                        const checkDate = new Date(endDateString);
        
                                        const isInRange = checkDate >= _startDate && checkDate <= _endDate;
                                        var correct = {}
                                        if(!isInRange){
                                            correct.newStartDate = startDateString;
                                            correct.newEndDate = areAvailables[0].period.to;
                                        } else {
                                            correct.newStartDate = startDateString;
                                            correct.newEndDate = endDateString;
                                        }
        
                                        // HERE I WANT TO SET THE MAX DATE TO BE correct.newEndDate
                                        // NOW THE CORRECT DATES ARE IN THE correct OBJECT, BUT YOU MIGHT NEED TO DO SOME CALCULATIONS BASED ON THE SELECTED PERIOD, AND THE SELECTED AVAILABLE PERIOD IS IN THE areAvailables ARRAY.
                                        // CODE BY Faisal Ali (faisal.supple@gmail.com)
                                        var newEndDate=$(".available.daterangepicker-has-tooltip.end-date.active.in-range").attr("data-date");
                                        $(".check-in-date").val('');
                                        $(".check-in-date").attr('data-value',correct.newStartDate);
                                        $(".check-in-date").val(correct.newStartDate);
                                        // $("input[name='checkout']").val(newEndDate);
                                        sessionStorage.setItem("checkin_dates", correct.newStartDate);
                                        sessionStorage.setItem("checkout_dates", newEndDate);
                                       // // console.log(newEndDate);
                					var checkin_date=sessionStorage.getItem("checkin_dates");
                					var checkout_date=sessionStorage.getItem("checkout_dates");
                				//	// console.log(checkin_date)
                				//	// console.log(checkout_date)
                                        
                                        $(".check-out-date").attr('data-value',newEndDate);
                                        $(".date-range-picker").val(correct.newStartDate);
                                        
                                     
                                        $("input[name='checkin']").val(correct.newStartDate);
                                        $("input[name='checkout']").val(newEndDate);
                                        // $("input[name='checkin']").val(startDateString);
                                        // $("input[name='checkout']").val(endDateString);
                                        var today=correct.newStartDate;
                                        var tomorrow=newEndDate;
                                        // alert(tomorrow  );
                                        // Loop through availability data to find the selected date range price
                                        for (var i = 0; i < availabilityData.length; i++) {
                                            var period = availabilityData[i].period;
                                            var rent = availabilityData[i].pricing.rent;
											
                                            var cleaning = availabilityData[i].pricing.cleaning;
                                            if (startDateString <= period.to && endDateString >= period.from) {
                                                ////  console.log("selected date = "+ startDateString +"period.from="+period.to + "price: "+ rent);
                                                totalPrice = rent;
                                                 totalCleaning = cleaning;
                                                 break;
                                            }
                                        }
                                        if (!$('.price-quantity').hasClass('extra-service-custom-quantity')) {
        
                                        var priceText = $('.price-quantity .cs-form-price').text(totalCleaning.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " kr.");
                                        }
                                        var extra_text = $('.cs-form-price-details ul li:nth-child(2) .csf-pd-value').text();
                                        var extra = parseInt(extra_text.replace(/[^0-9]/g, ''), 10); 

                                        var total = totalPrice + 1800 + extra;
                                        // var formattedTotal = total.toLocaleString();
                                        var formattedTotal = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
                                        // Display the total price in the element with class 'base-price'
                                     var formattedBasePrice = totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                                    

                                   // // console.log("f0009")
//                                         $('.base-price,.csf-pd-total-base .csf-pd-value').text(formattedBasePrice + " kr.");
                                        // $_GET['price_total']
                                       // // console.log("f01")
//                                         $('.total-price-number').text(formattedTotal);
                                        $('.cs-form-price-details ul li:nth-child(2) .csf-pd-value').text(extra  + " kr.");
//                                         $('.cs-form-price-details-total .csf-pd-value').text(formattedTotal  + " kr.");
                                    var ajaxurl = "<?php echo admin_url('admin-ajax.php'); ?>";
                                    var hiddenFields = '<input type="hidden" name="base_price" class="base_price" value="' + totalCleaning + '">' +
                                    '<input type="hidden" name="total_price" class="total_price" value="' + totalPrice + '">' +
                                    '<input type="hidden" name="total_price" class="start_date" value="' + correct.newStartDate + '">' +
                                    '<input type="hidden" name="total_price" class="end_date" value="' + correct.newEndDate + '">' +
                                    '<input type="hidden" name="price_details_total" value="' + total + '">';
                                    $.ajax({
                                        url: ajaxurl, // WordPress-specific variable
                                        type: 'POST',
                                        data: {
                                            action: 'fetch_dates', // Action hook to handle in PHP
                                            start_date: today,
                                            end_date: tomorrow
                                        },
                                        success: function(response) {
// 											alert('ok')
//                                            console.log(response);
                                           // // console.log(response.message);
                                            if( response.message ){
                                                // alert("You can't select between the range");
                                            }else{
                                                // $('.total-price').text('');
                                                var totalCleaning=response.pricing.cleaning;
                                                var current_extra=$('.cs-form-price-details ul li:nth-child(2) .csf-pd-value').text();
                                                current_extra=current_extra.replace('kr.', '').replace('.', '');
                                               // // console.log(current_extra);
                                               // // console.log("OK")
                                               // // console.log(current_extra)
                                                // var totalPrice=response.pricing.total;
                                                var baseprice=response.pricing.rent;
                                                totalPrice=baseprice+parseInt(current_extra)+1800;
                                               console.log(totalPrice + "Hello");
                                                totalPrice=totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                                                $('.total-price-number').text(totalPrice);
                                                // $('#extra-service-id-36').attr("checked","false");
                                                // $(".checked_service").remove();
                                                // hiddenFieldsdate.remove();
                                            //    console.log(totalPrice)
                                                setTimeout(function() {
                                                    $('ul li.cs-form-price-details-total .csf-pd-value').text(totalPrice+ " kr.");
                                                    $('.cs-form-price-details').css('opacity','1')
                                                    $('.cs-form-price-details-total .csf-pd-value').css('opacity','1')
                                                },500);
                                                    
                                                
                                                
                                                
                                                baseprice=baseprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                                                $('.cs-form-price-details ul li:first-child .csf-pd-value').text(baseprice+ " kr.");
                                                // $('.base_price').val(totalCleaning);
                                            //    console.log("f02");
                                                $('.cs-form-total-price').css('opacity','1 !important')
                                                $('.total-price').css('opacity','1 !important')
                                            //    console.log(totalPrice+ " kr.")
                                                
                                            }
                                            
                                        },
                                        error: function(xhr, status, error) {
                                            // Handle any errors
                                        //    console.log('Error:', error);
                                                }
                                        });
                                        // Check if the hidden fields have already been appended
                                        if ($('.room-booking-form').next('.hidden-fields').length === 0) {
                                            // Append the hidden fields
                                            $('.room-booking-form').after('<div class="hidden-fields">' + hiddenFields + '</div>');
                                        } else {
                                            // Update the values of the existing hidden fields
                                            $('.base_price').val(totalCleaning);
                                            $('.total_price').val(totalPrice);
                                            $('.start_date').val(correct.newStartDate);
                                            $('.end_date').val(correct.newEndDate);
                                            // $('.start_date').val(startDateString);
                                            // $('.end_date').val(endDateString);
                                            $('input[name="price_details_total"]').val(total);
                                            $(".check-in-date").attr("data-value", correct.newStartDate);
                                            $(".check-out-date").attr("data-value", correct.newEndDate);
                                        }
                                            
                                            
                                            
                                            
                                    
                                   // // console.log("A new date selection was made: " + startDate.format('YYYY-MM-DD') + ' to ' + endDate.format('YYYY-MM-DD'));
                                    
                                    //   $('.cs-room-booking').trigger('click');
                                       $('.cs-form-success-message').trigger('click');
                                   
                                    
                                });
        
                                    $('.check-in-date').on('apply.daterangepicker', function(ev, picker) {
                                    //    console.log("daterangepicker3")
                                        $('.daterangepicker').addClass("new-date-picker");
                                        var startDate = picker.startDate;
                                        var endDate = picker.endDate;
                                        
                                        // // Format the dates if needed
                                        // var minDate = startDate.format('YYYY-MM-DD');
                                        // var maxDate = endDate.format('YYYY-MM-DD');
                                        var minDate = $('.check-in-date').attr('data-value');
                                        var maxDate = $('.check-out-date').attr('data-value');
                                    
                                        $('.check-out-date').daterangepicker({
                                            autoUpdateInput: false,
                                            // minDate:minDate ? minDate : null ,
                                            // maxDate: maxDate ? maxDate : null,
                                            startDate: moment(minDate), // Set initial start date if needed
                                            endDate: moment(maxDate),
                                    beforeShowDay: function(date) {
                                        var dateString = moment(date).format('YYYY-MM-DD');
                                        var available = false;
                                        var price = 0;
        
                                        // Check if the date is within any of the availability periods
                                        for (var i = 0; i < availabilityData.length; i++) {
                                            var period = availabilityData[i].period;
        
                                            if (dateString >= period.from && dateString <= period.to) {
        
                                                available = true; // Date is available
                                                price = availabilityData[i].pricing.rent;
                                            //    console.log(price)
                                               // // console.log(availabilityData[i].pricing);
                                               // // console.log("period.from="+period.from + "price = " + availabilityData[i].pricing.total_excl_deposit + "rent="+ availabilityData[i].pricing.rent);
                                                break;
                                            }
                                        }
        
                                        // Return an array: [available, cssClass, tooltip]
                                        if (available) {
                                            return [true, 'available', 'Available. Price: ' + price];
                                        } else {
                                            return [false, 'unavailable', 'Not available.'];
                                        }
                                    }
                                }, function(startDate , endDate, label) {
                                   // // console.log(start);
                                      var totalPrice = 0;
                                       var totalCleaning = 0;
                                       var returnVal = false;
                                        var startDateString = startDate.format('YYYY-MM-DD');
                                        var endDateString = endDate.format('YYYY-MM-DD');
                                            // CODE BY Faisal Ali (faisal.supple@gmail.com)
                                         var nextDateAvailable = true;
                                        let areAvailables = [];
                                         var nextDate = moment(startDate).add(1, 'days').format('YYYY-MM-DD');
                                        for (var i = 0; i < availabilityData.length; i++) {
        
                                            var period = availabilityData[i].period;
                                           // // console.log( period );
                                           
        
                                            if (nextDate >= period.from && nextDate <= period.to) {
                                                nextDateAvailable = true; 
                                                areAvailables.push(availabilityData[i])
                                                break;
                                            } 
                                            
                                            if (startDate == period.from && endDate == period.to) {
                                                returnVal = true;
                                            } 
                                        }
                                        
                                        return returnVal;
                                     //    console.log(areAvailables)
                                    //    console.log(startDateString, endDateString)
                                            const _startDate = new Date(areAvailables[0].period.from);
                                            const _endDate = new Date(areAvailables[0].period.to);
                                            
                                            const checkDate = new Date(endDateString);
                                            
                                            const isInRange = checkDate >= _startDate && checkDate <= _endDate;
                                            var correct = {}
                                            if(!isInRange){
                                                 correct.newStartDate = startDateString;
                                                 correct.newEndDate = areAvailables[0].period.to;
                                            } else {
                                                correct.newStartDate = startDateString;
                                                correct.newEndDate = endDateString;
                                            }
        
                                    // HERE I WANT TO SET THE MAX DATE TO BE correct.newEndDate
                                    // NOW THE CORRECT DATES ARE IN THE correct OBJECT, BUT YOU MIGHT NEED TO DO SOME CALCULATIONS BASED ON THE SELECTED PERIOD, AND THE SELECTED AVAILABLE PERIOD IS IN THE areAvailables ARRAY.
                                    // CODE BY Faisal Ali (faisal.supple@gmail.com)
                                        $(".check-in-date").val('');
                                        $(".check-in-date").attr('data-value',correct.newStartDate);
                                        $(".check-in-date").val(correct.newStartDate);
                                        $(".check-out-date").val(correct.newEndDate);
                                        $(".check-out-date").attr('data-value',correct.newEndDate);
											
										$('input[name="checkin"]').val( correct.newStartDate );
										$('input[name="checkout"]').val( correct.newEndDate );

                                        $(".date-range-picker").val(correct.newStartDate);
                                        
                                        
          
        
                                        
                                        for (var i = 0; i < availabilityData.length; i++) {
                                            var period = availabilityData[i].period;
                                            var rent = availabilityData[i].pricing.rent;
                                            var cleaning = availabilityData[i].pricing.cleaning;
                                            if (startDateString <= period.to && endDateString >= period.from) {
                                                ////  console.log("selected date = "+ startDateString +"period.from="+period.to + "price: "+ rent);
                                                totalPrice = rent;
                                                 totalCleaning = cleaning;
                                                 break;
                                            }
                                        }
                                        $('.cs-form-field.cs-rooms.cs-has-dropdown .field-input-wrap input').val(totalPrice);
                                        var priceText = $('.cs-form-price').text();
                                        
                                        // Remove "kr." from the text
                                        var priceWithoutKrAndDot = priceText.replace('kr.', '').replace('.', '');
                                        var priceWithoutKrAndDotNumber = parseInt(priceWithoutKrAndDot);
        
                                        var total = totalPrice + priceWithoutKrAndDotNumber;
                                        // var formattedTotal = total.toLocaleString();
                                        var formattedTotal = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
                                        // Display the total price in the element with class 'base-price'
                                     var formattedTotalPrice = totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
                                //    console.log("f00010")
                                        $('.base-price,.csf-pd-total-base .csf-pd-value').text(formattedTotalPrice + " kr.");
                                       console.log("f03");
                                        $('.total-price-number').text(formattedTotal);
                                        $('.cs-form-price-details-total .csf-pd-value').text(formattedTotal  + " kr.");
                                        
                                        var hiddenFields = '<input type="hidden" name="base_price" class="base_price" value="' + priceWithoutKrAndDotNumber + '">' +
                                           '<input type="hidden" name="total_price" class="total_price" value="' + totalPrice + '">' +
                                           '<input type="hidden" name="price_details_total" value="' + formattedTotal + '">';
                                           
                                            var hiddenFieldsdate = '<input type="hidden" name="checkin_new" class="base_price" value="' + correct.newStartDate + '">' +
                                           '<input type="hidden" name="checkout_new" class="checkout" value="' + correct.newEndDate + '">'+
                                             '<input type="hidden" name="total_cleaning" value="' + totalCleaning + '">'+
                                             '<input type="hidden" name="price_total" value="' + totalPrice + '">';
                        
                                    $('.room-booking-form').after(hiddenFields);
                                    $('.cs-form-field.cs-submit').after(hiddenFieldsdate);
                                   // // console.log("A new date selection was made: " + startDate.format('YYYY-MM-DD') + ' to ' + endDate.format('YYYY-MM-DD'));
                            
                                        });
                                    });
                                    
                                    
                                    $('.check-out-date').on('apply.daterangepicker', function(ev, picker) {
                                        
                                  //    console.log("daterangepicker4")
                                        $('.daterangepicker').addClass("new-date-picker");
                                      var startDate = picker.startDate;
                                          var endDate = picker.endDate;
                                    
                                    // // Format the dates if needed
                                    var minDate = startDate.format('YYYY-MM-DD');
                                    var maxDate = endDate.format('YYYY-MM-DD');
                                        $('.check-in-date').daterangepicker({
                                            autoUpdateInput: false,
                                            // minDate:minDate ? minDate : null ,
                                            // maxDate: maxDate ? maxDate : null,
                                            startDate: moment(minDate), // Set initial start date if needed
                                            endDate: moment(maxDate),
                                    beforeShowDay: function(date) {
                                        var dateString = moment(date).format('YYYY-MM-DD');
                                        var available = false;
                                        var price = 0;
        
                                        // Check if the date is within any of the availability periods
                                        for (var i = 0; i < availabilityData.length; i++) {
                                            var period = availabilityData[i].period;
        
                                            if (dateString >= period.from && dateString <= period.to) {
        
                                                available = true; // Date is available
                                                price = availabilityData[i].pricing.rent;
                                            //    console.log(price)
                                               // // console.log(availabilityData[i].pricing);
                                               // // console.log("period.from="+period.from + "price = " + availabilityData[i].pricing.total_excl_deposit + "rent="+ availabilityData[i].pricing.rent);
                                                break;
                                            }
                                        }
        
                                        // Return an array: [available, cssClass, tooltip]
                                        if (available) {
                                            return [true, 'available', 'Available. Price: ' + price];
                                        } else {
                                            return [false, 'unavailable', 'Not available.'];
                                        }
                                    }
                                }, function(startDate , endDate, label) {
                                   // // console.log(start);
                                      var totalPrice = 0;
                                       var totalCleaning = 0;
                                        var startDateString = startDate.format('YYYY-MM-DD');
                                        var endDateString = endDate.format('YYYY-MM-DD');
                                            // CODE BY Faisal Ali (faisal.supple@gmail.com)
                                         var nextDateAvailable = true;
                                        let areAvailables = [];
                                         var nextDate = moment(startDate).add(1, 'days').format('YYYY-MM-DD');
                                        for (var i = 0; i < availabilityData.length; i++) {
        
                                            var period = availabilityData[i].period;
                                           
        
                                            if (nextDate >= period.from && nextDate <= period.to) {
                                                nextDateAvailable = true; 
                                                areAvailables.push(availabilityData[i])
                                                break;
                                            } 
                                        }
                                     //    console.log(areAvailables)
                                     //    console.log("f3")
                                       // // console.log(startDateString, endDateString)
                                            const _startDate = new Date(areAvailables[0].period.from);
                                            const _endDate = new Date(areAvailables[0].period.to);
                                            
                                            const checkDate = new Date(endDateString);
                                            
                                            const isInRange = checkDate >= _startDate && checkDate <= _endDate;
                                            var correct = {}
                                            if(!isInRange){
                                                 correct.newStartDate = startDateString;
                                                 correct.newEndDate = areAvailables[0].period.to;
                                            } else {
                                                correct.newStartDate = startDateString;
                                                correct.newEndDate = endDateString;
                                            }
        
                                        // HERE I WANT TO SET THE MAX DATE TO BE correct.newEndDate
                                        // NOW THE CORRECT DATES ARE IN THE correct OBJECT, BUT YOU MIGHT NEED TO DO SOME CALCULATIONS BASED ON THE SELECTED PERIOD, AND THE SELECTED AVAILABLE PERIOD IS IN THE areAvailables ARRAY.
                                        // CODE BY Faisal Ali (faisal.supple@gmail.com)
                                        $(".check-in-date").val('');
                                        $(".check-in-date").attr('data-value',correct.newStartDate);
                                        $(".check-in-date").val(correct.newStartDate);
                                        $(".check-out-date").val(correct.newEndDate);
                                        $(".check-out-date").attr('data-value',correct.newEndDate);
                                        $(".date-range-picker").val(correct.newStartDate);
											
										$("input[name='checkin']").val(correct.newStartDate);
                                        $("input[name='checkout']").val(correct.newEndDate);
                                        
                                        
          
        
                                        
                                        for (var i = 0; i < availabilityData.length; i++) {
                                            var period = availabilityData[i].period;
                                            var rent = availabilityData[i].pricing.rent;
                                            var cleaning = availabilityData[i].pricing.cleaning;
                                            if (startDateString <= period.to && endDateString >= period.from) {
                                                ////  console.log("selected date = "+ startDateString +"period.from="+period.to + "price: "+ rent);
                                                totalPrice = rent;
                                                 totalCleaning = cleaning;
                                                 break;
                                            }
                                        }
                                        $('.cs-form-field.cs-rooms.cs-has-dropdown .field-input-wrap input').val(totalPrice);
                                        var priceText = $('.cs-form-price').text();
                                        
                                        // Remove "kr." from the text
                                        var priceWithoutKrAndDot = priceText.replace('kr.', '').replace('.', '');
                                        var priceWithoutKrAndDotNumber = parseInt(priceWithoutKrAndDot);
        
                                        var total = totalPrice + priceWithoutKrAndDotNumber;
                                        // var formattedTotal = total.toLocaleString();
                                        var formattedTotal = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
                                        // Display the total price in the element with class 'base-price'
                                     var formattedTotalPrice = totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
                                        $('.base-price,.csf-pd-total-base .csf-pd-value').text(formattedTotalPrice + " kr.");
                                       console.log("f04");
                                        $('.total-price-number').text(formattedTotal);
                                        $('.cs-form-price-details-total .csf-pd-value').text(formattedTotal  + " kr.");
                                        
                                        var hiddenFields = '<input type="hidden" name="base_price" class="base_price" value="' + priceWithoutKrAndDotNumber + '">' +
                                           '<input type="hidden" name="total_price" class="total_price" value="' + totalPrice + '">' +
                                           '<input type="hidden" name="price_details_total" value="' + formattedTotal + '">';
                                           
                                            var hiddenFieldsdate = '<input type="hidden" name="checkin_new" class="base_price" value="' + correct.newStartDate + '">' +
                                           '<input type="hidden" name="checkout_new" class="checkout" value="' + correct.newEndDate + '">'+
                                             '<input type="hidden" name="total_cleaning" value="' + totalCleaning + '">'+
                                             '<input type="hidden" name="price_total" value="' + totalPrice + '">';
                        
                                    $('.room-booking-form').after(hiddenFields);
                                    $('.cs-form-field.cs-submit').after(hiddenFieldsdate);
                                   // // console.log("A new date selection was made: " + startDate.format('YYYY-MM-DD') + ' to ' + endDate.format('YYYY-MM-DD'));
                            
                                        });
                                    });
                                    //   $('.check-out-date').on('apply.daterangepicker', function(ev, picker) {
                                    //   var startDate = picker.startDate;
                                    //       var endDate = picker.endDate;
                                    
                                    // // Format the dates if needed
                                    // var minDate = startDate.format('YYYY-MM-DD');
                                    // var maxDate = endDate.format('YYYY-MM-DD');
                                    //     $('.check-in-date').daterangepicker({
                                    //         autoUpdateInput: false,
                                    //         minDate:minDate ? minDate : null ,
                                    //         maxDate: maxDate ? maxDate : null,
                                    //     });
                                    // });
                                // $('.check-in-date,.check-out-date').daterangepicker({
                                $('.check-in-date').daterangepicker({
                                    // $('.date-range-picker').daterangepicker({
                                    // singleDatePicker: true,
                                            
                                    autoUpdateInput: false, // Disable auto update input field
                                    locale: {
                                        format: 'YYYY-MM-DD', // Define the desired date format
                                        // You can customize other locale options here
                                    },
                                    // onSelect: function(start, end) {
                                    //     alert("works");
                                    // },
                                    beforeShowDay: function(date) {

                                        if (counterVar == 1) {
                                            jQuery("div.drp-buttons").append(
                                                "<div class='dateBoxes'><div class='startDateBox'></div><span>Start Date</span><div class='endDateBox'></div><span>Start & end Date</span><div class='endingDateBox'></div><span>End Date</span></div>"
                                            );
                                            counterVar++;
                                        }
                                    
                                        var dateString = moment(date).format('YYYY-MM-DD');
                                        var available = false;
                                        var price = 0;
                                        var rangeClasses = "";
                                        var betweenRange = "";
                                        var rangeStartDate = "";
                                        var inCalender = false;
                                    
                                        // Check if the date is within any of the availability periods
                                        for (var i = 0; i < availabilityData.length; i++) {
                                            var period = availabilityData[i].period;
                                    
                                            rangeClasses = "available";
                                            price = availabilityData[i].pricing.rent;
                                            
                                            if (dateString === period.from) {
                                                var checkDate = startingDates.includes(dateString);
                                                
                                                if (checkDate) {
                                                    betweenRange = 'startAndStartDate';
                                                } else {
                                                    betweenRange = 'startingDate';
                                                }
                                                available = true; // Date is available
                                                
                                            } 
                                            
                                            if (dateString === period.to) {
                                                startingDates.push(dateString);
                                                betweenRange = 'endingDate';
                                                available = true; // Date is available
                                            }
                                            
                                            // Add the betweenRangeDate class for dates between period.from and period.to
                                            if (dateString > period.from && dateString < period.to) {
                                                betweenRange = 'betweenRangeDate';
                                                // available = true; // Date is available
                                            }
                                        }
                                        
                                        if (!inCalender) {
                                            // betweenRange = betweenRange + " bookedDates";
                                        }
                                        
                                        // Return an array: [available, cssClass, tooltip]
                                        if (available) {
                                            return [true, betweenRange, 'Available. Price: ' + price];
                                        } else {
                                            return [false, betweenRange + 'unavailable booked', 'Not available.'];
                                        }
                                    }

                                }, function(startDate , endDate, label) {
                                    // alert("start");
                                    var ajaxurl = "<?php echo admin_url('admin-ajax.php'); ?>";
                                      var totalPrice = 0;
                                       var totalCleaning = 0;
                                        var startDateString = startDate.format('YYYY-MM-DD');
                                        var endDateString = endDate.format('YYYY-MM-DD');
                                       // // console.log(startDateString)
                                       // // console.log(endDateString)
                                       // // console.log(availabilityData.length)
                                        today=startDateString;
                                        tomorrow=endDateString;
                                         $.ajax({
                                            url: ajaxurl, // WordPress-specific variable
                                            type: 'POST',
                                            data: {
                                                action: 'fetch_dates', // Action hook to handle in PHP
                                                start_date: today,
                                                end_date: tomorrow
                                            },
                                            success: function(response) {
                                                // Handle the response from the PHP file
                                               // // console.log('Response:', response.message);
                                               // // console.log('Days:', response.period.days);
                                                if(response.message){
                                                    // alert("You can't select between the range");
                                                }else{
                                                    var nextDateAvailable = true;
                                                    let areAvailables = [];
                                                    var nextDate = moment(startDate).add(1, 'days').format('YYYY-MM-DD');
                                                    for (var i = 0; i < availabilityData.length; i++) {
                    
                                                        var period = availabilityData[i].period;
                                                       
                    
                                                        if (nextDate >= period.from && nextDate <= period.to) {
                                                            nextDateAvailable = true; 
                                                            areAvailables.push(availabilityData[i])
                                                            break;
                                                        } 
                                                    }
                                                    ////  console.log(areAvailables)
                                                   // // console.log(startDateString, endDateString)
                                                    const _startDate = new Date(areAvailables[0].period.from);
                                                    const _endDate = new Date(areAvailables[0].period.to);
                                                    
                                                    const checkDate = new Date(endDateString);
                                                    
                                                    const isInRange = checkDate >= _startDate && checkDate <= _endDate;
                                                    var correct = {}
                                                    if(!isInRange){
                                                         correct.newStartDate = startDateString;
                                                         correct.newEndDate = areAvailables[0].period.to;
                                                    } else {
                                                        correct.newStartDate = startDateString;
                                                        correct.newEndDate = endDateString;
                                                    }
            
                                                    // HERE I WANT TO SET THE MAX DATE TO BE correct.newEndDate
                                                    // NOW THE CORRECT DATES ARE IN THE correct OBJECT, BUT YOU MIGHT NEED TO DO SOME CALCULATIONS BASED ON THE SELECTED PERIOD, AND THE SELECTED AVAILABLE PERIOD IS IN THE areAvailables ARRAY.
                                                    // CODE BY Faisal Ali (faisal.supple@gmail.com)
                                                    var newEndDate=$(".available.daterangepicker-has-tooltip.end-date.active.in-range").attr("data-date");
                                                    $(".check-in-date").val('');
                                                    $(".check-in-date").attr('data-value',correct.newStartDate);
                                                    $(".check-in-date").val(correct.newStartDate);
                                                    $(".check-out-date").val(newEndDate);
                                                    $(".check-out-date").attr('data-value',newEndDate);
                                                    $(".date-range-picker").val(correct.newStartDate);
													
													$("input[name='checkin']").val(correct.newStartDate);
                                        			$("input[name='checkout']").val(correct.newEndDate);
                                                    
                                                   // // console.log(ava2)
                                                    sessionStorage.setItem("checkin_dates", correct.newStartDate);
                                                    sessionStorage.setItem("checkout_dates", newEndDate);
                                                    
                                                    $.ajax({
                                                        url: '<?php echo admin_url("admin-ajax.php") ?>', // WordPress-specific variable
                                                        type: 'POST',
                                                        data: {
                                                            action: 'fetch_dates', // Action hook to handle in PHP
                                                            start_date: correct.newStartDate,
                                                            end_date: newEndDate
                                                        },
                                                        success: function(response) {
                                                            if( response.message ) {
                                                                return false;
                                                                // alert("You can't select between the start date and end date");
                                                            }
                                                        }
                                                    });
                                                    
                                                    var listDate = [];
                                                    var strDate=correct.newStartDate;
                                                    var dateMove = new Date(strDate);
                                                    while (strDate < newEndDate){
                                                      var strDate = dateMove.toISOString().slice(0,10);
                                                      listDate.push(strDate);
                                                      dateMove.setDate(dateMove.getDate()+1);
                                                    };
                                                   // // console.log(listDate);
                                                    var unavailableDates = $('.unavailable').map(function() {
                                                        return $(this).attr('data-date');
                                                    }).get();
                                                    // Create an array to store the filtered dates
                                                    var getcount=0;
                                                    var encounteredDates = {};
                                                    var filteredDates = listDate.filter(function(date) {
                                                        if (!unavailableDates.includes(date) && !encounteredDates[date]) {
                                                            // Increment getcount
                                                            getcount++;
                                                            // Mark the date as encountered
                                                            encounteredDates[date] = true;
                                                            return true;
                                                        }
                                                        return false;
                                                    });
                                                    if(getcount !=listDate.length){
                                                       // // console.log(1)
                                                        
                                                            $(".check-out-date").val(listDate[0]);
                                                            $(".check-out-date").attr('data-value',listDate[0]);
                                                        $('.check-in-date').data('daterangepicker').setStartDate(moment(listDate[0]));
                                                        $('.check-in-date').data('daterangepicker').setEndDate(moment(listDate[0]));
                                                    }else{
                                                       // // console.log(2)
                                                        $('.check-in-date').data('daterangepicker').setStartDate(moment(correct.newStartDate));
                                                        $('.check-in-date').data('daterangepicker').setEndDate(moment(newEndDate));
                                                        
                                                    }
                                            
                                            
                                                    // for (var i = 0; i < availabilityData.length; i++) {
                                                        var period = response.period;
                                                        var rent = response.pricing.rent;
                                                        var cleaning = response.pricing.cleaning;
                                                       // // console.log(cleaning)
                                                       // // console.log(rent)
                                                        if (startDateString <= period.to && endDateString >= period.from) {
                                                            ////  console.log("selected date = "+ startDateString +"period.from="+period.to + "price: "+ rent);
                                                            ////  console.log("selected date = "+ endDateString +"period.to="+period.to + "price: "+ rent);
                                                            totalPrice = rent;
                                                             totalCleaning = cleaning;
                                                             totalPrice=totalPrice;
                                                            //  break;
                                                        }
                                                    // }
                                                   // // console.log(totalPrice)
                                                    $('.cs-form-field.cs-rooms.cs-has-dropdown .field-input-wrap input').val(totalPrice);
                                                    var priceText = $('.cs-form-price').text();
                                                    
                                                    // Remove "kr." from the text
                                                    var priceWithoutKrAndDot = priceText.replace('kr.', '').replace('.', '');
                                                    var priceWithoutKrAndDotNumber = parseInt(priceWithoutKrAndDot);
                    
                                                    var total = totalPrice + priceWithoutKrAndDotNumber;
                                                    // var formattedTotal = total.toLocaleString();
                                                    var formattedTotal = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                    
                                                    // Display the total price in the element with class 'base-price'
                                                    var formattedTotalPrice = totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                    
                                                    $('.base-price,.csf-pd-total-base .csf-pd-value').text(formattedTotalPrice + " kr.");
                                                   console.log("f05");
                                                    $('.total-price-number').text(formattedTotal);
                                                    $('.cs-form-price-details-total .csf-pd-value').text(formattedTotal  + " kr.");
                                                
                                                    var hiddenFields = '<input type="hidden" name="base_price" class="base_price" value="' + priceWithoutKrAndDotNumber + '">' +
                                                       '<input type="hidden" name="total_price" class="total_price" value="' + totalPrice + '">' +
                                                       '<input type="hidden" name="price_details_total" value="' + formattedTotal + '">';
                                                       
                                                        var hiddenFieldsdate = '<input type="hidden" name="checkin_new" class="base_price" value="' + correct.newStartDate + '">' +
                                                       '<input type="hidden" name="checkout_new" class="checkout" value="' + newEndDate + '">'+
                                                         '<input type="hidden" name="total_cleaning" value="' + totalCleaning + '">'+
                                                         '<input type="hidden" name="price_total" value="' + totalPrice + '">';
                                
                                                    $('.room-booking-form').after(hiddenFields);
                                                    $('.cs-form-field.cs-submit').after(hiddenFieldsdate);
                                                }
                                            },
                                            error: function(xhr, status, error) {
                                                // Handle any errors
                                            //    console.log('Error:', error);
                                            }
                                        });
                                        
                                            // CODE BY Faisal Ali (faisal.supple@gmail.com)
                                   // // console.log("A new date selection was made: " + startDate.format('YYYY-MM-DD') + ' to ' + endDate.format('YYYY-MM-DD'));
                                });
            
            
                            
                        
                            // Update total when checkbox state changes
                            $('.extra-service-switcher').click(function() {                                
                                  $('.cs-form-success-message').trigger('click');
                                 var hiddenFieldsdate = '<input type="hidden" name="checked_service" class="checked_service" value="1">';
                        
                                    $('.cs-form-field.cs-submit').after(hiddenFieldsdate);
                                if ($(".start_date").length > 0 && $(".start_date").val() !== "") {
                                    if ($(this).prop('checked')) {                                        
                                        // var mainTotalPrice = 0;
                                    	var quantity = 1; // Default value
										var quantityInput = $('input[name="extra_service[extra_service_36]"]');
                                    // Check if the jQuery selector returned a valid object
                                    if (quantityInput && quantityInput.length > 0) {
                                        // If the selector returned a valid object, retrieve the value and parse it as an integer
                                        quantity = parseInt(quantityInput.val());
                                        // Check if the parsed quantity is a valid number
                                        if (isNaN(quantity)) {
                                            // If the parsed quantity is not a valid number, fallback to 1
                                            quantity = 1;
                                        }
                                    }
                                    var priceText = $('.extra-service-custom-quantity .cs-form-price').text().trim();
                                    var price = parseFloat(priceText.replace(/[^\d.-]/g, '')); 
                                    var qty_servicePrice = price * quantity;
										
                                    var price_total = parseInt($('input[name="total_price"]').val());
									var price_details_total = $('.total-price .total-price-number').text();
									var numericTotal = parseInt(price_details_total.replace(/[^0-9]/g, ''), 10); 
									var base_price = numericTotal - 1800;
									var previous_extra = $('.cs-form-price-details ul li:nth-child(2) .csf-pd-value').text();
									var numericTotal2 = parseInt(previous_extra.replace(/[^0-9]/g, ''), 10); 
                                    var extra=parseInt(numericTotal2) + parseInt(qty_servicePrice);
									var pervious_total = $('.cs-form-price-details-total .csf-pd-value').text();
									var numericTotal3 = parseInt(pervious_total.replace(/[^0-9]/g, ''), 10); 
                                    var tot=parseInt(qty_servicePrice)+parseInt(numericTotal3);
									var totalBasePriceText = document.querySelector('.csf-pd-total-base .csf-pd-value').textContent.trim();
                                    setTimeout(function() {
										 var liElement = `
															<li class="csf-pd-total-rengoring">
															<div class="csf-pd-label">Rengøring </div>
															<div class="csf-pd-value" style="opacity: 1;">1800 kr.</div>
															</li>
														`;

														// // // Check if the list has at least one <li>
														if ($('.cs-form-price-details ul li').length > 0) {
															// Insert the new <li> as the second <li> in the list
															$('.cs-form-price-details ul li:nth-child(2)').after(liElement);
														} else {
															// If no <li> exists, append it as the first item
															$('.cs-form-price-details ul').append(liElement);
														}
                                        $('.cs-form-price-details ul li.csf-pd-total-base .csf-pd-value').text(totalBasePriceText.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
										                                            $('.cs-form-price-details ul li:nth-child(2) .csf-pd-value').text(extra.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " kr.");

                                        $('.cs-form-price-details-total .csf-pd-value').text(tot.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')  + " kr.");
                                        $('.total-price-number').text(tot.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
                                    }, 100);
										    $('.cs-form-quantity').hide();

                                } else {
                                        var price_total = $('.total-price-number').text();
                                        var price_details_total = $('input[name="price_details_total"]').val();
                                        $(".checked_service").remove();
//                                         alert(price_total) //10.246
//                                         alert(price_details_total) //10111
                                        if (price_total !== undefined) {
                                        //    console.log("OK4")
                                            var quantityInput =  $('input[name="extra_service[extra_service_36]"]');
                                            var quantity = 1; // Default value
                                            
                                            // Check if the jQuery selector returned a valid object
                                            if (quantityInput && quantityInput.length > 0) {
                                                // If the selector returned a valid object, retrieve the value and parse it as an integer
                                                quantity = parseInt(quantityInput.val());
                                            
                                                // Check if the parsed quantity is a valid number
                                                if (isNaN(quantity)) {
                                                    // If the parsed quantity is not a valid number, fallback to 1
                                                    quantity = 1;
                                                }
                                            }
                                            var priceText = $('.extra-service-custom-quantity .cs-form-price').text().trim();
                                            var price = parseFloat(priceText.replace(/[^\d.-]/g, '')); 
                                            var qty_servicePrice = price * quantity;
                                            var price_total = $('.cs-form-price-details-total .csf-pd-value').text();
                                            price_total=price_total.replace('kr.', '').replace('.', '');
                                            var base_price=parseInt(price_total)-1800-parseInt(qty_servicePrice);
											var previous_extra = $('.cs-form-price-details ul li:nth-child(2) .csf-pd-value').text();
											var numericTotal3 = parseInt(previous_extra.replace(/[^0-9]/g, ''), 10); 
											var extra=parseInt(numericTotal3) - parseInt(qty_servicePrice);
											var pervious_total = $('.cs-form-price-details-total .csf-pd-value').text();
											var numericTotal3 = parseInt(pervious_total.replace(/[^0-9]/g, ''), 10); 
											var tot=parseInt(numericTotal3) - parseInt(qty_servicePrice);
											var totalBasePriceText = document.querySelector('.csf-pd-total-base .csf-pd-value').textContent.trim();
                                            setTimeout(function() {
												 var liElement = `
     <li class="csf-pd-total-rengoring">
       <div class="csf-pd-label">Rengøring </div>
       <div class="csf-pd-value" style="opacity: 1;">1800 kr.</div>
     </li>
 `;

// // // Check if the list has at least one <li>
if ($('.cs-form-price-details ul li').length > 0) {
    // Insert the new <li> as the second <li> in the list
    $('.cs-form-price-details ul li:nth-child(2)').after(liElement);
} else {
    // If no <li> exists, append it as the first item
    $('.cs-form-price-details ul').append(liElement);
}
                                                $('.cs-form-price-details ul li.csf-pd-total-base .csf-pd-value').text(totalBasePriceText.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
												 $('.cs-form-price-details ul li:nth-child(2) .csf-pd-value').text(extra.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " kr.");
                                                $('.cs-form-price-details-total .csf-pd-value').text(tot.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')  + " kr.");
                                                $('.total-price-number').text(tot.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
                                            }, 100);
										    $('.cs-form-quantity').show();
                                            
                                       // // console.log(price_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
            
                                        // setTimeout(function() {
                                        //     $('.csf-pd-total-base .csf-pd-value').text(price_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " kr.");
                                        //     $('.cs-form-price-details-total .csf-pd-value').text(price_details_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " kr.");
                                        //     $('.total-price-number').text(price_details_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
                                        // }, 500);
                                        }
                                    }
                                }
                                });
                        
        
                            
                             $('.cs-quantity .plus').on('click', function() {
                                    var total_price=$('span.total-price-number').text();
                                        total_price=total_price.replace('.', '')
                                    var current_extra=$('.cs-form-price-details ul li:nth-child(2) .csf-pd-value').text();
                                    current_extra=current_extra.replace('kr.', '').replace('.', '');
                                    if (total_price !== undefined) {
                                        var base = document.querySelector('.csf-pd-total-base .csf-pd-value').textContent.trim();
                                        // var extra=parseInt(current_extra)+135;
                                        var extra=parseInt(current_extra);
                                        var total=parseInt(total_price);
                                      
                                        setTimeout(function() {
                                            $('.csf-pd-total-base .csf-pd-value').text(base.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
                                            $('.cs-form-price-details ul li:nth-child(2) .csf-pd-value').text(extra.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " kr.");
                                            $('.total-price .total-price-number').text(total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
                                            $('.cs-form-price-details-total .csf-pd-value').text(total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " kr.");
                                        }, 100)
                                    }
										
                                });
        
                                $('.cs-quantity .minus').on('click', function() {
                                    
                                    //   $('.cs-form-success-message').trigger('click');
                                    //  $('.cs-form-price-details-total .csf-pd-value').text('');
                                    //     $('.total-price-number').text('');
                                       // // console.log("minus")
                                    // var $input = $(this).siblings('.input-text');
                                    // var val = parseInt($input.val());
                                    // var min = parseInt($input.attr('data-min')) || 1;
                            
                                    // if (val > min) {
                                    // // $input.val(val - 1);
                            
                                    //     // Update the hidden input field with the new quantity
                                    //     updateHiddenInput(val - 1);
                                    // }
                                    
                                    
                                    //   var price_total = $('input[name="total_price"]').val();
                                    // var price_details_total = $('input[name="price_details_total"]').val();
                                    var total_price=$('span.total-price-number').text();
                                        total_price=total_price.replace('.', '')
                                    //    console.log(total_price)
                                    var current_extra=$('.cs-form-price-details ul li:nth-child(2) .csf-pd-value').text();
                                    current_extra=current_extra.replace('kr.', '').replace('.', '');
                                    if (total_price !== undefined) {
                                        var base = document.querySelector('.csf-pd-total-base .csf-pd-value').textContent.trim();
                                        var extra=parseInt(current_extra);
                                        var total=parseInt(total_price);
                                    //    console.log(total_price)
                                        setTimeout(function() {
                                            $('.csf-pd-total-base .csf-pd-value').text(base.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
                                            $('.cs-form-price-details ul li:nth-child(2) .csf-pd-value').text(extra.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " kr.");
                                            $('.total-price .total-price-number').text(total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
                                            $('.cs-form-price-details-total .csf-pd-value').text(total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " kr.");
                                        }, 100)
                                        // if (price_total !== undefined) {
                                       // // console.log(price_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
            
                                        // setTimeout(function() {
                                        //     $('.csf-pd-total-base .csf-pd-value').text(price_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " kr.");
                                        //     $('.cs-form-price-details-total .csf-pd-value').text(price_details_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " kr.");
                                        //     $('.total-price-number').text(price_details_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
            
                                        // }, 500);
                                        // populate_form_fields_on_load(); 
                                    }
                                });
        
                                // Function to update the hidden input field with the quantity value
                                function updateHiddenInput(quantity) {
                                    var $hiddenInput = $('.cs-quantity .hidden-input');
                                    if ($hiddenInput.length === 0) {
                                        // If the hidden input field doesn't exist, create it
                                        $hiddenInput = $('<input>').attr({
                                            type: 'hidden',
                                            class: 'hidden-input',
                                            name: 'quantity',
                                            value: quantity
                                        });
                                        $('.cs-quantity').append($hiddenInput);
                                    } else {
                                        // If the hidden input field exists, update its value
                                        $hiddenInput.val(quantity);
                                    }
                                }
                                
                                   function  date_to_price(startDate,endDate ){
                                        // alert(startDate);
                                    }
                                    $('.check-in-date,.check-out-date').click( function(){
                                        if($(this).hasClass('popup_calender')){
                                            $('.daterangepicker.ltr.show-calendar.opensright').css('z-index',999999999);
                                        }
                                        
                                    });
                                $('.close-button').click( function(){
                                    $('.check-in-date, .check-out-date').trigger('cancel.daterangepicker');
        
                                     $('.check-in-date').removeClass('popup_calender');
                                    $('.check-out-date').removeClass('popup_calender');
                                });
                                $('a.elementor-button-link.button.cs-btn-outline.cs-btn-small.cs-btn-color-white.popup-box-enabled,a.elementor-button-link.button.popup-box-enabled,button.menu-toggle.elementor-widget-menu-toggle').click( function(){
                                    $('.check-in-date').addClass('popup_calender');
                                    $('.check-out-date').addClass('popup_calender');
                                    
                                });
                                
                                //========================================
                                // Enabling the range dates
                                //========================================
                            //   jQuery(".betweenRange").on("click", function(){
                            //         // alert("working");
                            //         alert(jQuery(this).data("date"));
                            //     });
                                //========= By M. Sajid ================//
                                // alert("works");
                                 $('.date-range-picker').on('show.daterangepicker', function(ev, picker) {
                                    //  alert("first");
                                    // Monitor the calendar state for start date selection
                                    picker.container.find('.available').on('click', function() {
                                        if (!picker.endDate || picker.endDate.isSame(picker.startDate)) {
                                            // This condition checks if only the start date is selected
                                            var startDate = picker.startDate.format('YYYY-MM-DD');
                                        //    console.log("Start date selected: " + startDate);
                            
                                            // Your custom event code here
                                            onStartDateSelected(startDate);
                                        }
                                    });
                                });
                            
                                function onStartDateSelected(startDate) {
                                    // Custom logic to handle start date selection
                                    alert("Start date selected: " + startDate);
                                    // Add more logic as needed
                                }
                                
                           

                            });

                            function highlightAvailableDates()
                            {
                            //    console.log("verified and working");
                                jQuery(document).ready(function($) {
                                    var startIndex = -1;
                                    var endIndex = -1;
                                    var startDate = '';
                                    var endDate = $(this).attr("data-date");
                                    var hasStartDateClass = false;

                                    // Find the indices of the start_date and end-date elements
                                    $('td').each(function(index) {
                                        $(this).addClass("highlight")
                                        var tdText = $(this).text();
                                        // alert( $(this).text() );
                                       // // console.log(tdText);

                                        if ($(this).hasClass('start-date')) {
                                            startIndex = index;
                                            hasStartDateClass = true;
                                        } else {
                                            hasStartDateClass = false;
                                        }
                                        if ($(this).hasClass('end-date')) {
                                            endIndex = index;
                                        }
                                        
                                        if( hasStartDateClass ) {
                                            startDate = $(this).attr("data-date");
                                        }
                                    });

                                    // Highlight elements between start_date and end-date
                                    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
                                        $.ajax({
                                            url: ajaxurl, // WordPress-specific variable
                                            type: 'POST',
                                            data: {
                                                action: 'fetch_dates', // Action hook to handle in PHP
                                                start_date: startDate,
                                                end_date: endDate
                                            },
                                            success: function(response) {
                                                if(response.message=="Period is not available for booking."){
                                                    $('td').slice(startIndex, endIndex + 1).addClass('highlight');
                                                }
                                            },
                                            error: function(xhr, status, error) {
                                                // Handle any errors
                                            //    console.log('Error:', error);
                                            }
                                        });
                                    }

                                });
                            }
                        </script>
                        
                        
                        <?php
                    }, 9999);
                
            }
        }
    }
}
$url_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  
// Check if the URL path matches '/room/' or '/blommehuset/'
if (strpos($url_path, '/room/') !== false || strpos($url_path, '/blommehuset/') !== false || $url_path == '/' ) {
    add_action('template_redirect', 'trigger_curl_request_on_front_page'); 
    //  add_action('init', 'trigger_curl_request_on_front_page'); 
}




function trigger_curl_request_on_front_page_price() {
    // Check if on front page and debug parameter is set
    if (!is_admin()) {
        // Send cURL request to API
        $response = wp_remote_get(
            'https://api.villavilla.com/partner-api/v1/houses?house_id=222',
            [
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901'
                ]
            ]
        );

        if (is_wp_error($response)) {
            // Handle error, log, etc.
            $error_message = $response->get_error_message();
            echo "Error: $error_message";
        } else {
            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);

            // Pass availability data to the footer script
            add_action('wp_footer', function() use ($data) {
                ?>
                <script>
                    jQuery(document).ready(function($) {
                        var priceRoom = <?php echo json_encode($data[0]['base_prices']['deposit']['da']['price']); ?>;
                $('.overlay-label-text').text('Fra ' + priceRoom.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') +"KR");
            //    console.log("priceRoom")
                    //    console.log(priceRoom)
                    });
                </script>
                <?php
            }, 9999);
        }
    }
}
add_action('init', 'trigger_curl_request_on_front_page_price');



// Add jQuery script to redirect form on page load
function redirect_form_on_load() {
    unset($_GET['search_rooms']);
    ?>
    <script>
        jQuery(document).ready(function($) {
// 			alert('ok')
            // Check if the form element exists
            if ($('.cs-form-wrap').length) {
                // Construct the redirect URL with the desired page
                var redirectUrl = 'https://www.delchiya.de/room/blommehuset?search=1';
            //    console.log("homepage")
                $('.cs-form-wrap').append('<input type="hidden" class="main_startdate"><input type="hidden" class="main_enddate">');
				
            //    console.log($('.check-in-date').val())
                // Set the form action attribute to the redirect URL
                $('.cs-form-wrap').attr('action', redirectUrl);
                $('input[name="search_rooms"]').remove();
                $('.cs-form-field.cs-rooms.cs-has-dropdown .field-input-wrap input').val(0);
                $('.cs-form-field.cs-rooms.cs-has-dropdown .csf-dropdown.is-open').remove();;
            }
               
         

        });
    </script>
    <?php
}
add_action('wp_footer', 'redirect_form_on_load',99999999);






add_action('wp_ajax_get_hidden_field_value', 'get_hidden_field_value');
add_action('wp_ajax_nopriv_get_hidden_field_value', 'get_hidden_field_value');

function get_hidden_field_value() {

    $end_date = isset($_POST['end_date']) ? $_POST['end_date'] : '';
    $start_date = isset($_POST['start_date']) ? $_POST['start_date'] : '';
    $response = wp_remote_get(
        'https://api.villavilla.com/partner-api/v1/period?house_id=122&arrival='.$start_date.'&departure='.$end_date.'&currency_code=208',
        [
            'headers' => [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901'
            ]
        ]
    );

    if (is_wp_error($response)) {
        $error_message = $response->get_error_message();
        echo json_encode(['error' => $error_message]); // Return error message as JSON
    } else {
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        $data2 = json_decode($body, true);
        // print_r($data['pricing']);die;
        echo json_encode(['pricing' => $data['pricing']]); // Return response data as JSON
    }
    
    die(); // Terminate script execution
    
}


add_action('wp_ajax_add_to_cart_price_update', 'add_to_cart_price_update');
add_action('wp_ajax_nopriv_add_to_cart_price_update', 'add_to_cart_price_update');


function add_to_cart_price_update() {
    // 1. Grab the posted values
    $totalPrice = isset($_POST['price_details_total']) ? $_POST['price_details_total'] : '';
    $startDate  = isset($_POST['startDate'])          ? $_POST['startDate']          : '';
    $endDate    = isset($_POST['endDate'])            ? $_POST['endDate']            : '';

    // 2. Store them as transients
    set_transient('total_price', (int) $totalPrice, DAY_IN_SECONDS);
    set_transient('start_date', sanitize_text_field($startDate), DAY_IN_SECONDS);
    set_transient('end_date',   sanitize_text_field($endDate),   DAY_IN_SECONDS);

    // 3. Set a cookie (fixing the variable name)
    setcookie('total_price', $totalPrice, time() + DAY_IN_SECONDS, "/");

    // 4. Return the numeric price back to the AJAX call
    echo esc_html($totalPrice);
    wp_die();
}
add_action('wp_ajax_add_to_cart_price_update', 'add_to_cart_price_update');
add_action('wp_ajax_nopriv_add_to_cart_price_update', 'add_to_cart_price_update');



add_action('woocommerce_before_calculate_totals', 'custom_cart_item_price');
function custom_cart_item_price($cart) {
    // Don't run in the admin (except AJAX)
    if (is_admin() && !defined('DOING_AJAX')) {
        return;
    }

    foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
        if (isset($cart_item['set_price']) && $cart_item['set_price'] > 0) {
            $cart_item['data']->set_price($cart_item['set_price']);
        }
    }
}


add_filter('woocommerce_add_cart_item_data', 'update_cart_item_price', 10, 2);
function update_cart_item_price($cart_item_data, $product_id) {
    // 1. If JS has injected a hidden input named "set_price", grab it
    if (! empty($_POST['set_price'])) {
        $submitted_price = intval($_POST['set_price']);
        if ($submitted_price > 0) {
            $cart_item_data['set_price'] = $submitted_price;
        }
    }

    // 2. Carry over dates from transients (if set)
    if ($sd = get_transient('start_date')) {
        $cart_item_data['start_date'] = sanitize_text_field($sd);
    }
    if ($ed = get_transient('end_date')) {
        $cart_item_data['end_date'] = sanitize_text_field($ed);
    }

    return $cart_item_data;
}

// Display custom data in the cart and checkout page
add_filter('woocommerce_get_item_data', 'display_custom_data_in_cart', 10, 2);

function display_custom_data_in_cart($item_data, $cart_item) {
    if (isset($cart_item['start_date'])) {
        $item_data[] = array(
            'key'   => __('Start Date', 'woocommerce'),
            'value' => wc_clean($cart_item['start_date']),
            'display' => wc_clean($cart_item['start_date']),
        );
    }

    if (isset($cart_item['end_date'])) {
        $item_data[] = array(
            'key'   => __('End Date', 'woocommerce'),
            'value' => wc_clean($cart_item['end_date']),
            'display' => wc_clean($cart_item['end_date']),
        );
    }

    return $item_data;
}

// Preserve the custom fields in the cart item session data
add_filter('woocommerce_add_cart_item', 'preserve_custom_fields_in_cart', 10, 2);
add_filter('woocommerce_get_cart_item_from_session', 'preserve_custom_fields_in_cart', 10, 3);

function preserve_custom_fields_in_cart($cart_item, $values, $key = '') {
    if (isset($values['start_date'])) {
        $cart_item['start_date'] = $values['start_date'];
    }

    if (isset($values['end_date'])) {
        $cart_item['end_date'] = $values['end_date'];
    }
    if (isset($values['set_price'])) {
        $cart_item['set_price'] = $values['set_price'];
    }


    return $cart_item;
}

// Save custom data to order
add_action('woocommerce_checkout_create_order_line_item', 'save_custom_data_to_order_items', 10, 4);

function save_custom_data_to_order_items($item, $cart_item_key, $values, $order) {
    if (isset($values['start_date'])) {
        $item->add_meta_data(__('Start Date', 'woocommerce'), $values['start_date'], true);
    }

    if (isset($values['end_date'])) {
        $item->add_meta_data(__('End Date', 'woocommerce'), $values['end_date'], true);
    }
}

// Display custom data in the order backend
add_action('woocommerce_admin_order_item_headers', 'add_custom_order_item_header');
add_action('woocommerce_admin_order_item_values', 'display_custom_order_item_data', 10, 3);

function add_custom_order_item_header() {
    echo '<th class="wc-order-item-custom-fields">' . __('Start Date', 'woocommerce') . '</th>';
    echo '<th class="wc-order-item-custom-fields">' . __('End Date', 'woocommerce') . '</th>';
}

function display_custom_order_item_data($product, $item, $item_id) {
    $start_date = $item->get_meta('Start Date');
    $end_date = $item->get_meta('End Date');

    echo '<td class="wc-order-item-custom-fields">' . ( $start_date ? esc_html($start_date) : '-' ) . '</td>';
    echo '<td class="wc-order-item-custom-fields">' . ( $end_date ? esc_html($end_date) : '-' ) . '</td>';
}

function trigger_curl_request_on_front_page_test() {
        global $wp;

    // Check if on front page and debug parameter is set    if (is_page(2875)) {
    // if (!is_admin() && isset($_GET['get']) && $_GET['get'] == true) {
     $current_url = home_url($_SERVER['REQUEST_URI']);
// print_r($current_url);die;
    // Check if the current page URL matches the gallery page URL
   
    if (!is_admin() && strpos($current_url, '/gallery/') !== false) {
        // Send cURL request to API
        $response = wp_remote_get(
            'https://api.villavilla.com/partner-api/v1/houses?house_id=222',
            [
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901'
                ]
            ]
        );

        if (is_wp_error($response)) {
            // Handle error, log, etc.
            $error_message = $response->get_error_message();
            echo "Error: $error_message";
        } else {
            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);
            
            $images = $data[0]['images']['da'];
                        $image_urls = array_column($images, 'url');

                 add_action('wp_footer', function() use ($image_urls) {
                ?>
                <script>
                    jQuery(document).ready(function($) {
                        var images = <?php echo json_encode($image_urls); ?>;
                        var index = 0;
                        $('.elementor-background-slideshow__slide__image').css('background-image', 'url(' + images[index] + ')');
                       // // console.log(images[index] );

                        function changeBackground() {
                            index = (index + 1) % images.length;
                       // // console.log(index );
                       // // console.log(images[index] );
                            $('.elementor-background-slideshow__slide__image').css('background-image', 'url(' + images[index] + ')');
                            setTimeout(changeBackground, 3000); // Change image every 5 seconds
                        }
                        
                        changeBackground();
                    });
                </script>
                <?php
            }, 9999);
            // echo '<pre>';print_r(  $images);die;

           
        }
    }
    if(!is_admin() && strpos($current_url, '/blommehuset') !== false){
        $response = wp_remote_get(
            'https://api.villavilla.com/partner-api/v1/houses?house_id=122',
            [
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901'
                ]
            ]
        );

        if (is_wp_error($response)) {
            // Handle error, log, etc.
            $error_message = $response->get_error_message();
            echo "Error: $error_message";
        } else {
            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);
            
            $images = $data[0]['images']['da'];
                        $image_urls = array_column($images, 'url');

                 add_action('wp_footer', function() use ($image_urls) {
                ?>
                <script>
                    jQuery(document).ready(function($) {
                        var images = <?php echo json_encode($image_urls); ?>;
                        var currentSlideIndex = 0;
                            
                            $('.cs-gallery-wrap .slick-slide img').attr('src', '');
                            $('.cs-gallery-wrap .slick-slide').css('background-image', '');
                        function changeBackground() {
                            $('.cs-gallery-wrap .slick-slide img').attr('srcset', '');
                            // Update the background image of the current slide
                            $('.cs-gallery-wrap .slick-slide').eq(currentSlideIndex).find('img').attr('src', images[currentSlideIndex]);
                            $('.cs-gallery-wrap .slick-slide').eq(currentSlideIndex).find('img').removeAttr('srcset');
                        //    console.log(images[currentSlideIndex]);
                            // Move to the next slide
                            currentSlideIndex = (currentSlideIndex + 1) % images.length;
    
                            setTimeout(changeBackground, 3000); // Change image every 3 seconds
                        }
                        
                        changeBackground();
                    });
                </script>
                <?php
            }, 9999);
        }
    }
}
add_action('init', 'trigger_curl_request_on_front_page_test');
// Add action hooks for logged-in users and guests
add_action('wp_ajax_fetch_dates', 'fetch_dates_callback');
add_action('wp_ajax_nopriv_fetch_dates', 'fetch_dates_callback');

function fetch_dates_callback() {
    // Get the data passed from AJAX
    $start_date = isset($_POST['start_date']) ? sanitize_text_field($_POST['start_date']) : '';
    $end_date = isset($_POST['end_date']) ? sanitize_text_field($_POST['end_date']) : '';

    // Make the external API request
    $response2 = wp_remote_get(
        'https://api.villavilla.com/partner-api/v1/period?house_id=122&arrival='.$start_date.'&departure='.$end_date.'&currency_code=208',
        [
            'headers' => [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901'
            ]
        ]
    );

    if (is_wp_error($response2)) {
        $error_message2 = $response2->get_error_message();
        wp_send_json(['error' => $error_message2]); // Return error message as JSON
    } else {
        $body2 = wp_remote_retrieve_body($response2);
        $data2 = json_decode($body2, true);
        $noroom = isset($data2["errors"]) ? 1 : 0;
        if($noroom == 1){
            $data2 = ''; // Clear data if there's an error
        }
        wp_send_json($data2); // Return data as JSON
    }
}


// Enqueue jQuery UI Datepicker
function enqueue_datepicker() {
    wp_enqueue_script('jquery-ui-datepicker');
    wp_enqueue_style('jquery-ui', '//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css');
}
add_action('admin_enqueue_scripts', 'enqueue_datepicker');

// Add date fields to the coupon form
add_action('woocommerce_coupon_options', 'add_custom_coupon_date_fields');

function add_custom_coupon_date_fields() {
    woocommerce_wp_text_input(array(
        'id' => 'date_from',
        'label' => __('Period From', 'woocommerce'),
        'desc_tip' => 'true',
        'description' => __('Select the start date.', 'woocommerce'),
        'type' => 'text',
        'class' => 'datepicker',
        'placeholder' => 'YYYY-MM-DD'
    ));

    woocommerce_wp_text_input(array(
        'id' => 'date_to',
        'label' => __('Period To', 'woocommerce'),
        'desc_tip' => 'true',
        'description' => __('Select the end date.', 'woocommerce'),
        'type' => 'text',
        'class' => 'datepicker',
        'placeholder' => 'YYYY-MM-DD'
    ));
}


// Initialize the Datepicker
function initialize_datepicker() {
    ?>
    <script type="text/javascript">
        jQuery(document).ready(function($) {
            $('.datepicker').datepicker({
                dateFormat: 'yy-mm-dd'
            });
        });
    </script>
    <?php
}
add_action('admin_footer', 'initialize_datepicker');


// Save custom fields values
add_action('woocommerce_coupon_options_save', 'save_custom_coupon_fields');

function save_custom_coupon_fields($post_id) {
    $custom_field_one = isset($_POST['date_from']) ? sanitize_text_field($_POST['date_from']) : '';
    update_post_meta($post_id, 'date_from', $custom_field_one);

    $custom_field_two = isset($_POST['date_to']) ? sanitize_text_field($_POST['date_to']) : '';
    update_post_meta($post_id, 'date_to', $custom_field_two);
}


// die("testing");
// Ensure WooCommerce is active
// if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {

    // Function to print cart contents
    function print_cart_contents() {
        // Check if we are on the cart page
        if ( is_cart() ) {
            // Get the cart object
            $cart = WC()->cart;

            echo '<pre>';
            print_r( $cart );
            echo '</pre>';
        }
    }

    // Hook into WooCommerce cart page
    // add_action( 'template_redirect', 'print_cart_contents' );
// }

// Validate coupon based on custom dates
add_filter('woocommerce_coupon_is_valid', 'validate_coupon_based_on_dates', 10, 2);

function validate_coupon_based_on_dates($valid, $coupon) {
    // echo "<pre>";
    //  print_r($valid->responses);
    if (!$valid) {
        return $valid;
    }
    
    $coupon_start_date = get_post_meta($coupon->get_id(), 'date_from', true);
    $coupon_end_date = get_post_meta($coupon->get_id(), 'date_to', true);
    
    $coupon_start_date = new DateTime($coupon_start_date);
    $coupon_end_date = new DateTime($coupon_end_date);
    
    if (empty($coupon_start_date) && empty($coupon_end_date)) {
        return $valid;
    }
    
    $current_date = current_time('Y-m-d');
    $cart = WC()->cart->get_cart();
    
    foreach ($cart as $cart_item) {

        $start_date = isset($cart_item['start_date']) ? $cart_item['start_date'] : '';
        $end_date = isset($cart_item['end_date']) ? $cart_item['end_date'] : '';
        
        $start_date = new DateTime($start_date);
        $end_date = new DateTime($end_date);
        
        if (!empty($start_date) && !empty($end_date)) {
            if ( $start_date <= $coupon_start_date) {
                // wc_add_notice(__('Coupon is not valid for the selected date range.1', 'woocommerce'), 'error');
                add_filter( 'woocommerce_coupon_error', 'wp_kama_woocommerce_coupon_error_filter', 10, 3 );
                return false;
            } 
            
            if ( $end_date >= $coupon_end_date ) {
                // wc_add_notice(__('Coupon is not valid for the selected date range.2', 'woocommerce'), 'error');
                add_filter( 'woocommerce_coupon_error', 'wp_kama_woocommerce_coupon_error_filter', 10, 3 );
                return false;
            }
            
        } 
    }
    
    return $valid;
}


/**
 * Function for `woocommerce_coupon_error` filter-hook.
 * 
 * @param string    $error_message Error message.
 * @param int       $error_code    Error code.
 * @param WC_Coupon $coupon        Coupon data.
 *
 * @return string
 */
function wp_kama_woocommerce_coupon_error_filter( $error_message, $error_code, $coupon ){

	// filter...
	return "Code is not valid for the selected days.";
}

function add_custom_click_script_to_footer() {
    ?>
    <script type="text/javascript">
        jQuery(document).ready(function($) {
            

            // Function to handle click events and show an alert
            // function setupClickEvents() {
                // Select elements with the specified classes
                $(document).trigger("click", 'td.startingDate', function() {
                    // alert($(this).data("date"));
                    // for (var i = 0; i < availabilityData.length; i++) { 
                        // alert(availabilityData)
                    // }
                });
            // }
            
            // Call the function to setup click events
            // setupClickEvents();
        });
    </script>
    <?php
}
add_action('wp_footer', 'add_custom_click_script_to_footer', 1000);



function change_extra_service_price_on_page_load_inline() {
    ?>
    <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() {
            // Find the input field by its name attribute
            var priceField = document.querySelector('input[name="extra_service_price[extra_service_36]"]');

            // Check if the field exists
            if (priceField) {
                // Set its value to 0
                priceField.value = 0;
            }
        });
    </script>
    <?php
}
add_action( 'wp_footer', 'change_extra_service_price_on_page_load_inline' , 1500);

function prevent_text_change_script() {
    // Add inline script to prevent text changes
    $script = "
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.total-price-number').forEach(function(element) {
            const originalText = element.textContent; // Store the original text

            // Observer to revert changes if the text is modified
            const observer = new MutationObserver(function() {
                if (element.textContent !== originalText) {
                    element.textContent = originalText; // Revert to original text
                }
            });

            // Observe for text changes
            observer.observe(element, { childList: true, characterData: true, subtree: true });
        });
    });
    ";

    // Enqueue the script
    wp_enqueue_script('prevent-text-change', false, [], false, true);
    wp_add_inline_script('prevent-text-change', $script);
}
// add_action('wp_enqueue_scripts', 'prevent_text_change_script', 100);

// Register the event
if (!wp_next_scheduled('fetch_and_download_images')) {
    wp_schedule_event(time(), 'daily', 'fetch_and_download_images');
}

// Hook the function to the event
add_action('fetch_and_download_images', 'download_images_from_api');
function download_images_from_api() {
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://api.villavilla.com/partner-api/v1/houses/?house_id=122",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "Accept: */*",
            "Authorization: Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901",
            "User-Agent: Thunder Client (https://www.thunderclient.com)"
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        error_log("Error fetching data: " . $err);
        return;
    }

    $decoded_response = json_decode($response);
    if (is_array($decoded_response) && isset($decoded_response[0]->images->da)) {
        $images = $decoded_response[0]->images->da;

        // Directory to save the images
        $save_dir = __DIR__ . '/images/';

        // Ensure the directory exists
        if (!is_dir($save_dir)) {
            mkdir($save_dir, 0755, true);
        }

        // Remove all previous images from the folder
        $existing_files = glob($save_dir . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);
        foreach ($existing_files as $file) {
            unlink($file);
        }

        // Loop through each image and download using $image->url
        foreach ($images as $key => $image) {
            if (isset($image->url)) {
                // Get the image content
                $image_content = file_get_contents($image->url);
                if ($image_content !== false) {
                    // Generate a unique filename
                    $filename = $save_dir . 'image_' . $key . '.jpg'; // Adjust extension if needed
                    // Save the image to the directory
                    file_put_contents($filename, $image_content);
                    error_log("Downloaded: " . $filename);
                } else {
                    error_log("Failed to download image: " . $image->url);
                }
            } else {
                error_log("No URL found for image index: $key");
            }
        }
    } else {
        error_log("No images found in the API response.");
    }
}

function del_add_custom_js_to_footer() {
    ?>
    <script type="text/javascript">
        jQuery(document).ready(function ($) {
            // Select the element
            var priceDetailsTotal = $('.cs-form-price-details-total > .csf-pd-value');

            // Check if it has any child elements
            if (priceDetailsTotal.children().length > 0) {
                // Remove the text content of .csf-pd-value
                priceDetailsTotal.text('');
            }
        });
    </script>
    <?php
}
// add_action('wp_footer', 'del_add_custom_js_to_footer', 3000);

// ======================================
function sajid_custom_inline_script() {
    // Enqueue jQuery if not already loaded
    wp_enqueue_script('jquery');
    
    // Inline JavaScript code
    $inline_js = "
    jQuery(document).ready(function($) {
        setTimeout(function() {
            $('.total-price-number').css('display', 'inline-flex');
            // Append the copied element to the .cs-form-price-details container
            var priceDetails = document.querySelector('.cs-form-price-details');
            if (priceDetails) {
                // priceDetails.appendChild(copyElement); // Append the copy to the parent container
                
                // Loop through each child of .cs-form-price-details and add the 'copy' prefix to their class names
                var childNodes = priceDetails.children;
                for (var i = 0; i < childNodes.length; i++) {
                    var child = childNodes[i];
                    // Add 'copy-' prefix to each class name of the child element
                    for (var j = 0; j < child.classList.length; j++) {
                        var className = child.classList[j];
                        child.classList.replace(className, 'copy-' + className);
                    }
                }
            }
        }, 3000);
        
        // On click of .cs-form-total-price
        $(document).on('click', '.cs-form-total-price', function() {
            // Get the value/text of .total-price-number
            var priceValue = $('.total-price-number').text();
            
            // Replace the value into .cs-form-price-details-total > .csf-pd-value
            $('.cs-form-price-details-total .csf-pd-value').text(priceValue);
        });
        
    });
    ";
    
    // Add the inline script
    wp_add_inline_script('jquery', $inline_js);
    
    // Additional script for single room post type pages only
    if ( is_singular('loftocean_room') ) {
        $room_js = "
        jQuery(document).ready(function($) {
            setTimeout(function() {
            
               // Select the .start_date and .end_date elements
                var startDate = $('.start_date').val();
                var endDate = $('.end_date').val();
                
                // Log the values to the console
                console.log('Start Date:', startDate);
                console.log('End Date:', endDate);
                
                $('.check-in-date').attr('data-value', startDate);
                $('.check-out-date').attr('data-value', endDate);
                
//                 $('.date-range-picker').prop('value', startDate +' - '+ endDate);
				$('.date-range-picker').data('value', startDate + ' - ' + endDate);

var dateRange = $('.date-range-picker').data('value');
console.log('final Date:' , dateRange);  // Logs the value of the custom data attribute

            }, 1000); // Delay of 2 seconds (2000ms)
        });
        ";
        
        // Add the room-specific script
        wp_add_inline_script('jquery', $room_js);
    }
}
add_action('wp_enqueue_scripts', 'sajid_custom_inline_script');

function add_inline_script_for_room_single() {
    if ( is_singular('room') ) {
        ?>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                console.log('This is a single room page.');
                // Add your JavaScript logic here
            });
        </script>
        <?php
    }
}
// add_action('wp_footer', 'add_inline_script_for_room_single', 1000); // Use a high priority to ensure it runs last.


// Handle AJAX request to store the custom price in WooCommerce session
add_action('wp_ajax_add_to_cart_price_update', 'handle_add_to_cart_price_update');
add_action('wp_ajax_nopriv_add_to_cart_price_update', 'handle_add_to_cart_price_update');

function handle_add_to_cart_price_update() {
    if (isset($_POST['price_details_total'])) {
        $price = floatval($_POST['price_details_total']);
        WC()->session->set('custom_price', $price);
    }
    wp_send_json_success();
}

add_action('wp_ajax_add_custom_booking', 'handle_custom_booking');
add_action('wp_ajax_nopriv_add_custom_booking', 'handle_custom_booking');

function handle_custom_booking() {
    $price = intval($_GET['price']);
    $start_date = sanitize_text_field($_GET['start_date']);
    $end_date = sanitize_text_field($_GET['end_date']);

    // Create a virtual product object dynamically
    $product = new WC_Product();
    $product->set_name("Room Booking from $start_date to $end_date");
    $product->set_price($price / 100); // Woo expects decimal
    $product->set_virtual(true);
    $product->set_sold_individually(true);

    // Remove current cart and add this
    WC()->cart->empty_cart();
    WC()->cart->add_to_cart($product->get_id());

    // Store custom meta in session for checkout display
    WC()->session->set('booking_start', $start_date);
    WC()->session->set('booking_end', $end_date);

    wp_redirect(wc_get_checkout_url());
    exit;
}
add_filter('woocommerce_get_item_data', 'show_booking_dates_on_checkout', 10, 2);
function show_booking_dates_on_checkout($item_data, $cart_item) {
    if ($start = WC()->session->get('booking_start')) {
        $item_data[] = [
            'key' => 'Start Date',
            'value' => $start,
        ];
    }
    if ($end = WC()->session->get('booking_end')) {
        $item_data[] = [
            'key' => 'End Date',
            'value' => $end,
        ];
    }
    return $item_data;
}
