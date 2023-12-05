import React, { useRef, useState, useEffect } from 'react';

import { injectIntl } from 'react-intl';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';

import Slider from 'nuka-carousel';

const useStyle = makeStyles(() => ({
  appBar: {
    backgroundColor: '#FAFAFA',
  },
  toolbar: {
    padding: '0px',
  },
  menuItem: {
    height: '64px',
    justifyContent: 'center',
    color: '#949FB0',
    fontFamily: 'Roboto, sans-serif',
    textTransform: 'uppercase',
    borderRight: '1px solid rgba(148,159,176, 0.3)',
    '&:first-child': {
      borderLeft: '1px solid rgba(148,159,176, 0.3)',
    },
  },
  arrows: {
    padding: '3px',
  },
  selected: {
    backgroundColor: '#586374',
    border: 'none',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#586374',
    },
  },
}));

const ranges = [7, 30, 90, 0];

const PreRangeCarousel = ({ onChange, range, intl: { formatMessage } }) => {
  const classes = useStyle();

  const slideRef = useRef();
  const [showButtons, setShowButtons] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(ranges.indexOf(parseInt(range, 10)));
  }, [range]);

  const slideResize = ({ frameWidth, slideCount, slideWidth }) => {
    if (frameWidth < slideWidth * slideCount) {
      if (!showButtons) setShowButtons(true);
    } else {
      if (showButtons) setShowButtons(false);

      if (!slideRef.current) return;

      const { frame } = slideRef.current;
      const ul = frame.children[0];
      ul.style.transform = 'translate3d(0px, 0px, 0px)';
    }
  };

  const onNext =
    ({ nextSlide, slideCount, ...props }) =>
    () => {
      if (selectedIndex < slideCount - 1) {
        const newIndex = selectedIndex + 1;
        setSelectedIndex(newIndex);

        if (onChange) onChange(ranges[newIndex]);
      }
      const { frame } = slideRef.current;
      const ul = frame.children[0];

      const frameRect = frame.getBoundingClientRect();
      const ulRect = ul.getBoundingClientRect();

      if (ulRect.x + ulRect.width < frameRect.x + frameRect.width) {
        return;
      }

      nextSlide();
    };

  const onPrev =
    ({ previousSlide }) =>
    () => {
      if (selectedIndex > 0) {
        const newIndex = selectedIndex - 1;
        setSelectedIndex(newIndex);

        if (onChange) onChange(ranges[newIndex]);
      }
      previousSlide();
    };

  const selectOnClick = (index) => () => {
    if (index !== selectedIndex) {
      setSelectedIndex(index);

      if (onChange) onChange(ranges[index]);
    }
  };

  return (
    <AppBar position="relative" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Box width={1}>
          <Slider
            ref={slideRef}
            cellAlign="left"
            dragging={false}
            disableEdgeSwiping
            slideWidth="100px"
            width="100%"
            renderBottomCenterControls={slideResize}
            framePadding={showButtons ? '0px 35px' : '0px'}
            renderCenterLeftControls={
              !showButtons
                ? () => <div />
                : (props) => (
                    <IconButton
                      onClick={onPrev(props)}
                      className={classes.arrows}
                    >
                      <ArrowLeft />
                    </IconButton>
                  )
            }
            renderCenterRightControls={
              !showButtons
                ? () => <div />
                : (props) => (
                    <IconButton
                      onClick={onNext(props)}
                      className={classes.arrows}
                    >
                      <ArrowRight />
                    </IconButton>
                  )
            }
          >
            {ranges.map((el, index) => (
              <MenuItem
                key={`${el}-${index}`}
                onClick={selectOnClick(index)}
                className={`${classes.menuItem} ${
                  index === selectedIndex ? classes.selected : ''
                }`}
              >
                {el > 0
                  ? `${el} ${formatMessage({ id: 'days' })}`
                  : `${formatMessage({ id: 'all' })}`}
              </MenuItem>
            ))}
          </Slider>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default injectIntl(PreRangeCarousel);
