(function($) {
  $(document).ready(function() {
    if(!$('.image-compare-block').length) return;
    $('.image-compare-block').each(function() {
      const $block = $(this);
      const $preview = $block.find('.image-compare__preview');
      const $slider = $block.find('.image-compare__slider');
      const $afterWrapper = $block.find('.image-compare__after-wrapper');
      const orientation = $block.hasClass('vertical') ? 'vertical' : 'horizontal';
      let isDragging = false;
      let sliderPosition = 50;
  
      function updateSlider() {
        if (orientation === 'horizontal') {
          $slider.css({
            'left': sliderPosition + '%',
            'transform': 'translateX(-50%)'
          });
          $afterWrapper.css('clip-path', 'inset(0 0 0 ' + sliderPosition + '%)');
        } else {
          $slider.css({
            'top': sliderPosition + '%',
            'transform': 'translateY(-50%)'
          });
          $afterWrapper.css('clip-path', 'inset(' + sliderPosition + '% 0 0 0)');
        }
      }
  
      $slider.on('mousedown touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
        
        $('body').css({
          'cursor': orientation === 'horizontal' ? 'col-resize' : 'row-resize',
          'user-select': 'none'
        });
        
        calculatePosition(e.type === 'touchstart' ? e.originalEvent.touches[0] : e);
      });
  
      $(document).on('mousemove touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        calculatePosition(e.type === 'touchmove' ? e.originalEvent.touches[0] : e);
      });
  
      $(document).on('mouseup touchend', function() {
        if (!isDragging) return;
        isDragging = false;
        
        $('body').css({
          'cursor': '',
          'user-select': ''
        });
      });
  
      function calculatePosition(event) {
        const rect = $preview[0].getBoundingClientRect();
        let newPosition;
  
        if (orientation === 'horizontal') {
          newPosition = ((event.clientX - rect.left) / rect.width) * 100;
        } else {
          newPosition = ((event.clientY - rect.top) / rect.height) * 100;
        }
  
        sliderPosition = Math.min(100, Math.max(0, newPosition));
        updateSlider();
      }
  
      updateSlider();
    });
  });
})(jQuery);

