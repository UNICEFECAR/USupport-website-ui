import React, { useEffect, useId, useRef, useState } from "react";
import classNames from "classnames";

import { PhIcon } from "../../components/PhIcon/PhIcon";

import "./ph-language-select.scss";

/**
 * PhLanguageSelect
 *
 * Language dropdown for the Play and Heal header. Follows the listbox
 * pattern: arrow keys move, Enter/Space select, Escape closes, and the
 * dropdown closes when clicking outside or tabbing away.
 *
 * @param {Array<{value: string, label: string, name: string}>} languages
 * @param {string} value - current language
 * @param {function} onChange - called with the chosen language value
 * @param {string} label - accessible label, e.g. "Language"
 * @returns {JSX.Element}
 */
export const PhLanguageSelect = ({ languages, value, onChange, label }) => {
  const id = useId();
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const optionRefs = useRef([]);

  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = Math.max(
    0,
    languages.findIndex((lang) => lang.value === value)
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const current = languages[selectedIndex];

  // Close when clicking or tapping outside
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  // Keep keyboard focus on the highlighted option while open
  useEffect(() => {
    if (isOpen) optionRefs.current[activeIndex]?.focus();
  }, [isOpen, activeIndex]);

  const open = (index = selectedIndex) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const close = ({ returnFocus = true } = {}) => {
    setIsOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  const select = (index) => {
    close();
    const lang = languages[index];
    if (lang && lang.value !== value) onChange(lang.value);
  };

  const handleButtonKeyDown = (e) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      open(
        e.key === "ArrowUp"
          ? (selectedIndex - 1 + languages.length) % languages.length
          : selectedIndex
      );
    }
  };

  const handleListKeyDown = (e) => {
    const last = languages.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i === last ? 0 : i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i === 0 ? last : i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        select(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close({ returnFocus: false });
        break;
      default:
    }
  };

  return (
    <div
      className={classNames("ph-language", isOpen && "ph-language--open")}
      ref={rootRef}
    >
      <button
        type="button"
        ref={buttonRef}
        className="ph-language__button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-list`}
        aria-label={`${label}: ${current.name}`}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleButtonKeyDown}
      >
        <PhIcon name="globe" size={18} />
        <span className="ph-language__value">{current.label}</span>
        <PhIcon
          name="chevron-down"
          size={14}
          classes="ph-language__chevron"
        />
      </button>

      {isOpen && (
        <ul
          id={`${id}-list`}
          className="ph-language__list"
          role="listbox"
          aria-label={label}
          onKeyDown={handleListKeyDown}
        >
          {languages.map((lang, index) => {
            const isSelected = index === selectedIndex;
            return (
              <li
                key={lang.value}
                ref={(el) => (optionRefs.current[index] = el)}
                role="option"
                aria-selected={isSelected}
                tabIndex={index === activeIndex ? 0 : -1}
                className={classNames(
                  "ph-language__option",
                  isSelected && "ph-language__option--selected"
                )}
                onClick={() => select(index)}
                onMouseMove={() =>
                  index !== activeIndex && setActiveIndex(index)
                }
              >
                {/* Only the name carries the language, so rows stay aligned */}
                <span
                  className="ph-language__option-name"
                  lang={lang.value}
                  dir={lang.dir}
                >
                  {lang.name}
                </span>
                <span className="ph-language__option-code" aria-hidden="true">
                  {lang.label}
                </span>
                <span className="ph-language__check" aria-hidden="true">
                  {isSelected && <PhIcon name="check" size={16} />}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
