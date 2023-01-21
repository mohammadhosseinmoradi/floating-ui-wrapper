import {forwardRef, Fragment, useEffect, useRef} from "react";
import {arrow, autoUpdate, flip, offset, size, useFloating, shift} from "@floating-ui/react";

const Float = forwardRef(function Float({
                                             as: As = Fragment,
                                             strategy = 'fixed',
                                             placement: placementProp = 'top',
                                             offset: offsetProp = 0,
                                             shift: shiftProp = 0,
                                             arrowPadding = 10,
                                             arrowOffset = -4,
                                             overflow = true,
                                             children, ...otherProps
                                         }, ref) {
    const arrowRef = useRef(null);
    const {x, y, placement, middlewareData, reference, floating, refs} = useFloating({
        placement: placementProp,
        strategy,
        middleware: [
            offset(offsetProp),
            flip(),
            shift({
                padding: shiftProp
            }),
            arrow({
                element: arrowRef,
                padding: arrowPadding
            }),
            size({
                apply({availableWidth, availableHeight, elements}) {
                    if (!overflow) {
                        Object.assign(elements.floating.style, {
                            maxWidth: `${availableWidth}px`,
                            maxHeight: `${availableHeight}px`,
                        });
                    }
                }
            })
        ],
        whileElementsMounted: (...args) => {
            return autoUpdate(...args, {
                animationFrame: false
            });
        }
    });

    useEffect(() => {
        if (refs.reference.current && refs.floating.current) {
            Object.assign(refs.floating.current.style, {
                position: strategy,
                left: `${x}px`,
                top: `${y}px`
            });

            if (arrowRef.current && middlewareData.arrow) {
                const {x, y, centerOffset} = middlewareData.arrow;

                Object.assign(arrowRef.current.style, {
                    position: 'absolute',
                    left: x != null ? `${x}px` : 'unset',
                    top: y != null ? `${y}px` : 'unset',
                    [{
                        top: 'bottom',
                        right: 'left',
                        bottom: 'top',
                        left: 'right',
                    }[placement.split('-')[0]]]: `${centerOffset + arrowOffset}px`
                })
            }
        }
    }, [x, y, placement, middlewareData, reference, floating, strategy])

    return As != null ? <As ref={ref} {...otherProps}>
        {
            typeof children === 'function' ?
                children({reference, floating, arrow: arrowRef}) : children
        }
    </As> : typeof children === 'function' ? children({reference, floating, arrow: arrowRef}) : children
})
module.exports = Float;