import { useRef } from 'react';
import './CategorySelector.scss'; // Create a CSS file for styling the carousel component
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import scrollIntoView from 'scroll-into-view';

const Carousel = ({ categoriesData, currentIndex, setCurrentIndex }) => {
  const containerRef = useRef(null);
  const activeCategoryRef = useRef(null);

  const handlePrevClick = () => {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
    scrollToActiveCategory();
  };

  const handleNextClick = () => {
    if (currentIndex === categoriesData.length - 1) return;
    setCurrentIndex(currentIndex + 1);
    scrollToActiveCategory();
  };

  const scrollToActiveCategory = () => {
    if (activeCategoryRef.current) {
      scrollIntoView(activeCategoryRef.current, {
        time: 200,
        ease: (t) =>
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1, // easeInOutCubic
      });

      // activeCategoryRef.current.scrollIntoView({
      //   behavior: 'smooth',
      //   inline: 'center',
      // });
    }
  };

  const navArrowClasses = `
      dn dib-ns v-top w-5-ns h3 h3dot5-ns
      lh-3 lh-3dot5-ns tc
      bg-pismo-near-white pismo-light-silver
      ba b--pismo-lighter-gray collapse
    `;
  const outerContainerClasses = 'MonthsCarousel shadow-pismo-3';
  const outerContainerStyle = { overflowX: 'hidden', overflowY: 'hidden' };
  const containerClasses = 'w-100 h3 h3dot5-ns nowrap bg-transparent collapse';
  const carouselContainerStyle = { overflowX: 'auto', overflowY: 'hidden' };

  return (
    <div
      className={outerContainerClasses}
      style={outerContainerStyle}
      ref={containerRef}
    >
      <div className={containerClasses}>
        <div
          className={`${navArrowClasses} ${
            currentIndex <= 0 ? 'noclick' : 'pointer'
          }`}
          onClick={handlePrevClick}
          // onKeyDown={this.handlePreviousArrowKeyDown}
          role="button"
          tabIndex={0}
        >
          <div>
            <MdArrowBack />
          </div>
        </div>

        <div
          className="dib v-top w-100 w-90-ns"
          style={carouselContainerStyle}
          role="tablist"
          tabIndex={0}
        >
          {categoriesData.map((category, index) => (
            <div
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                scrollToActiveCategory();
              }}
              className={`relative dit v-mid h3 h3dot5-ns w3dot3-s w4-ns collapse tc animate-all
            bg-pismo-near-white pismo-light-silver fw4
            ba b--pismo-lighter-gray pointer carousel__item
            ${index === currentIndex ? 'false carousel__item--active' : ''}`}
              ref={index === currentIndex ? activeCategoryRef : null}
            >
              <span className="dtc v-mid">{category?.label}</span>
            </div>
          ))}
        </div>
        <div
          className={`${navArrowClasses} ${
            currentIndex >= categoriesData.length - 1 ? 'noclick' : 'pointer'
          }`}
          onClick={handleNextClick}
          role="button"
          tabIndex={0}
        >
          <div>
            <MdArrowForward />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
