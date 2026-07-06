(function () {
  function installControlFixes() {
    var style = document.createElement('style');
    style.textContent = [
      '.controls, .controls * { -webkit-user-select: none; user-select: none; }',
      '.controls input, .controls button, .controls label { pointer-events: auto; }',
      '.controls input[type="range"] { touch-action: none; cursor: pointer; }',
      '#canvas-container canvas { touch-action: none; }'
    ].join('\n');
    document.head.appendChild(style);

    var activeRange = null;
    var rangeSelector = '.controls input[type="range"]';

    function isControlEvent(event) {
      return Boolean(event.target && event.target.closest && event.target.closest('.controls'));
    }

    function isRangeEvent(event) {
      return Boolean(event.target && event.target.closest && event.target.closest(rangeSelector));
    }

    function beginRangeDrag(event) {
      activeRange = event.target.closest(rangeSelector);
      event.stopPropagation();
    }

    function continueRangeDrag(event) {
      if (activeRange || isRangeEvent(event)) {
        event.stopPropagation();
      }
    }

    function endRangeDrag(event) {
      if (activeRange || isRangeEvent(event)) {
        event.stopPropagation();
      }
      activeRange = null;
    }

    function bindRange(range) {
      if (range.dataset.controlFixBound) return;
      range.dataset.controlFixBound = 'true';
      range.addEventListener('pointerdown', beginRangeDrag);
      range.addEventListener('pointermove', continueRangeDrag);
      range.addEventListener('pointerup', endRangeDrag);
      range.addEventListener('pointercancel', endRangeDrag);
      range.addEventListener('touchstart', beginRangeDrag, { passive: true });
      range.addEventListener('touchmove', continueRangeDrag, { passive: true });
      range.addEventListener('touchend', endRangeDrag);
      range.addEventListener('touchcancel', endRangeDrag);
      range.addEventListener('mousedown', beginRangeDrag);
      range.addEventListener('mousemove', continueRangeDrag);
      range.addEventListener('mouseup', endRangeDrag);
      range.addEventListener('click', function (event) {
        event.stopPropagation();
      });
      range.addEventListener('input', function (event) {
        event.stopPropagation();
      });
      range.addEventListener('change', function (event) {
        event.stopPropagation();
      });
    }

    function bindRanges() {
      document.querySelectorAll(rangeSelector).forEach(bindRange);
    }

    bindRanges();
    new MutationObserver(bindRanges).observe(document.body, { childList: true, subtree: true });

    document.addEventListener('pointermove', continueRangeDrag);
    document.addEventListener('pointerup', endRangeDrag);
    document.addEventListener('pointercancel', endRangeDrag);
    document.addEventListener('touchmove', continueRangeDrag, { passive: true });
    document.addEventListener('touchend', endRangeDrag);
    document.addEventListener('touchcancel', endRangeDrag);
    document.addEventListener('mousemove', continueRangeDrag);
    document.addEventListener('mouseup', endRangeDrag);

    document.addEventListener('wheel', function (event) {
      if (isControlEvent(event)) event.stopPropagation();
    }, { capture: true, passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installControlFixes);
  } else {
    installControlFixes();
  }
}());
