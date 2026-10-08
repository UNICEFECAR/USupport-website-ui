import React, { useRef } from "react";
import classNames from "classnames";
import { Page } from "react-pdf";

import "./ph-flipbook.scss";

/**
 * The pages visible for a "view" - a two-page spread, or a single page.
 * In spread mode the cover (page 1) sits alone on the right like a real book.
 */
export const getView = (page, numPages, isSpread) => {
  if (!isSpread) return { left: null, right: page };
  if (page <= 1) return { left: null, right: 1 };

  const left = page % 2 === 0 ? page : page - 1;
  return { left, right: left + 1 <= numPages ? left + 1 : null };
};

export const getNextPage = (page, numPages, isSpread) => {
  if (!isSpread) return page < numPages ? page + 1 : null;
  if (page <= 1) return numPages >= 2 ? 2 : null;

  const { left } = getView(page, numPages, true);
  return left + 2 <= numPages ? left + 2 : null;
};

export const getPreviousPage = (page, numPages, isSpread) => {
  if (!isSpread) return page > 1 ? page - 1 : null;
  if (page <= 1) return null;

  const { left } = getView(page, numPages, true);
  return left - 2 >= 2 ? left - 2 : 1;
};

/**
 * Works out where each page sits and how it animates.
 * slot 0 = left half of the book, slot 1 = right half.
 */
const getPageRoles = ({ page, numPages, isSpread, turning }) => {
  const roles = new Map();
  const add = (pageNumber, role) => {
    if (pageNumber && !roles.has(pageNumber)) roles.set(pageNumber, role);
  };

  const slotOf = (side) => (isSpread && side === "right" ? 1 : 0);

  if (turning) {
    const { from, to, direction } = turning;

    if (!isSpread) {
      if (direction === "next") {
        add(from.right, { slot: 0, animation: "out-single", z: 3 });
        add(to.right, { slot: 0, z: 1 });
      } else {
        add(to.right, { slot: 0, animation: "in-single", z: 3 });
        add(from.right, { slot: 0, z: 1 });
      }
    } else if (direction === "next") {
      // The right page lifts off, then the next left page lands on top
      add(from.right, { slot: 1, animation: "out-next", z: 3 });
      add(to.left, { slot: 0, animation: "in-next", z: 3 });
      add(from.left, { slot: 0, z: 1 });
      add(to.right, { slot: 1, z: 1 });
    } else {
      add(from.left, { slot: 0, animation: "out-prev", z: 3 });
      add(to.right, { slot: 1, animation: "in-prev", z: 3 });
      add(to.left, { slot: 0, z: 1 });
      add(from.right, { slot: 1, z: 1 });
    }

    return roles;
  }

  const view = getView(page, numPages, isSpread);
  add(view.left, { slot: slotOf("left"), z: 1 });
  add(view.right, { slot: slotOf("right"), z: 1 });

  // Render the neighbouring views off-screen so turning is instant
  const neighbours = [
    getNextPage(page, numPages, isSpread),
    getPreviousPage(page, numPages, isSpread),
  ].filter(Boolean);

  neighbours.forEach((neighbour) => {
    const neighbourView = getView(neighbour, numPages, isSpread);
    add(neighbourView.left, { slot: 0, hidden: true });
    add(neighbourView.right, { slot: slotOf("right"), hidden: true });
  });

  return roles;
};

/**
 * PhFlipbook
 *
 * Issuu-style book: two-page spreads (or single pages on small screens and
 * for landscape documents) with a 3D page-turn animation. Click a page or
 * swipe to turn. Right-to-left documents are mirrored so they read like an
 * Arabic book.
 *
 * @returns {JSX.Element}
 */
export const PhFlipbook = ({
  page,
  numPages,
  isSpread,
  isRtl,
  turning,
  pageWidth,
  pageHeight,
  turnDuration,
  canTurn,
  onTurn,
  onFirstPageLoad,
}) => {
  const stageRef = useRef(null);
  const pointerStartX = useRef(null);
  const didSwipe = useRef(false);

  const roles = getPageRoles({ page, numPages, isSpread, turning });
  const targetView = turning
    ? turning.to
    : getView(page, numPages, isSpread);

  // Centre the book when only the cover or the back page is showing
  let offset = 0;
  if (isSpread && !targetView.left) offset = -pageWidth / 2;
  if (isSpread && !targetView.right) offset = pageWidth / 2;

  const handlePointerDown = (e) => {
    pointerStartX.current = e.clientX;
    didSwipe.current = false;
  };

  const handlePointerUp = (e) => {
    if (pointerStartX.current === null) return;
    const deltaX = e.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (!canTurn || Math.abs(deltaX) < 40) return;

    didSwipe.current = true;
    const swipedForward = isRtl ? deltaX > 0 : deltaX < 0;
    onTurn(swipedForward ? "next" : "previous");
  };

  // Clicking the right half turns forward, the left half turns back
  // (mirrored for right-to-left documents)
  const handleClick = (e) => {
    if (didSwipe.current || !canTurn) return;

    const rect = stageRef.current.getBoundingClientRect();
    const isRightHalf = e.clientX - rect.left > rect.width / 2;
    const forward = isRtl ? !isRightHalf : isRightHalf;
    onTurn(forward ? "next" : "previous");
  };

  return (
    <div
      className={classNames(
        "ph-flipbook",
        isRtl && "ph-flipbook--rtl",
        canTurn && "ph-flipbook--interactive"
      )}
      ref={stageRef}
      style={{
        width: (isSpread ? 2 : 1) * pageWidth,
        height: pageHeight,
        "--ph-turn-duration": `${turnDuration}ms`,
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => (pointerStartX.current = null)}
      onClick={handleClick}
    >
      <div
        className="ph-flipbook__book"
        style={{ transform: `translateX(${offset}px)` }}
      >
        {[...roles.entries()].map(([pageNumber, role]) => (
          <div
            key={pageNumber}
            className={classNames(
              "ph-flipbook__page",
              isSpread &&
                (role.slot === 0
                  ? "ph-flipbook__page--left"
                  : "ph-flipbook__page--right"),
              role.animation && `ph-flipbook__page--${role.animation}`,
              role.hidden && "ph-flipbook__page--hidden"
            )}
            style={{
              left: role.slot * pageWidth,
              width: pageWidth,
              height: pageHeight,
              zIndex: role.z || 0,
            }}
            aria-hidden={role.hidden || undefined}
          >
            <div className="ph-flipbook__content">
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={<div className="ph-flipbook__placeholder" />}
                onLoadSuccess={pageNumber === 1 ? onFirstPageLoad : undefined}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
