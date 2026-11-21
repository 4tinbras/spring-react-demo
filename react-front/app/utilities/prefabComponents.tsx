import {useState} from "react";

export function PrimaryButton({initialButtonText, onClickHandler}: { initialButtonText: string, onClickHandler: any }) {

    return (<button onClick={(event) => onClickHandler ? onClickHandler(event) : undefined}
                    className={"button-primary"}>{initialButtonText}</button>)
}

export function SecondaryButton({initialButtonText, onClickHandler}: {
    initialButtonText: string,
    onClickHandler: any
}) {

    return (<button onClick={() => onClickHandler ? onClickHandler() : undefined}
                    className={"button-secondary"}>{initialButtonText}</button>)
}

export function ImagesCarousel() {

    const NO_OF_ITEMS: number = 9;
    const OUTER_MARGIN_ITEMS: number = 1;
    const INNER_MARGIN_ITEMS: number = 1;
    const [activeImage, setActiveImage] = useState<number>(0);

    const switchImageOnClick = (input, event) => {

        if (activeImage + input === NO_OF_ITEMS) {
            setActiveImage(0);
        } else if (activeImage + input === -1) {
            setActiveImage(NO_OF_ITEMS-1);
        } else {
            setActiveImage(activeImage + input);
        }

    }

    function isImageWithinMargin(imageIndex: number, currentIndex: number, margin: number) {

        return (imageIndex >= currentIndex && imageIndex <= currentIndex + margin)
            || (imageIndex < currentIndex && imageIndex >= currentIndex - margin);
    }

    return (<div className={'carousel-container'}>
        <a className={'image-switch-anchor'} onClick={(event) => switchImageOnClick(-1, event)}>Prev</a>

        <div className={'carousel-image-container'}>
            <div {...(!isImageWithinMargin(0, activeImage, OUTER_MARGIN_ITEMS) ? {"hidden": true, "className": "carousel-image"} : activeImage === 0 ? {"className": "carousel-image-full-size carousel-image"} : {"className": "carousel-image carousel-image-margin"})}>
                <h1>First</h1>
            </div>
            <div {...(!isImageWithinMargin(1, activeImage, OUTER_MARGIN_ITEMS) ? {"hidden": true, "className": "carousel-image"} : activeImage === 1 ? {"className": "carousel-image-full-size carousel-image"} : {"className": "carousel-image carousel-image-margin"})}>
                <h1>Second</h1>
            </div>
            <div {...(!isImageWithinMargin(2, activeImage, OUTER_MARGIN_ITEMS) ? {"hidden": true, "className": "carousel-image"} : activeImage === 2 ? {"className": "carousel-image-full-size carousel-image"} : {"className": "carousel-image carousel-image-margin"})}>
                <h1>Third</h1>
            </div>
            <div {...(!isImageWithinMargin(3, activeImage, OUTER_MARGIN_ITEMS) ? {"hidden": true, "className": "carousel-image"} : activeImage === 3 ? {"className": "carousel-image-full-size carousel-image"} : {"className": "carousel-image carousel-image-margin"})}>
                <h1>Fourth</h1>
            </div>
            <div {...(!isImageWithinMargin(4, activeImage, OUTER_MARGIN_ITEMS) ? {"hidden": true, "className": "carousel-image"} : activeImage === 4 ? {"className": "carousel-image-full-size carousel-image"} : {"className": "carousel-image carousel-image-margin"})}>
                <h1>Fifth</h1>
            </div>
            <div {...(!isImageWithinMargin(5, activeImage, OUTER_MARGIN_ITEMS) ? {"hidden": true, "className": "carousel-image"} : activeImage === 5 ? {"className": "carousel-image-full-size carousel-image"} : {"className": "carousel-image carousel-image-margin"})}>
                <h1>Sixth</h1>
            </div>
            <div {...(!isImageWithinMargin(6, activeImage, OUTER_MARGIN_ITEMS) ? {"hidden": true, "className": "carousel-image"} : activeImage === 6 ? {"className": "carousel-image-full-size carousel-image"} : {"className": "carousel-image carousel-image-margin"})}>
                <h1>Seventh</h1>
            </div>
            <div {...(!isImageWithinMargin(7, activeImage, OUTER_MARGIN_ITEMS) ? {"hidden": true, "className": "carousel-image"} : activeImage === 7 ? {"className": "carousel-image-full-size carousel-image"} : {"className": "carousel-image carousel-image-margin"})}>
                <h1>Eighth</h1>
            </div>
            <div {...(!isImageWithinMargin(8, activeImage, OUTER_MARGIN_ITEMS) ? {"hidden": true, "className": "carousel-image"} : activeImage === 8 ? {"className": "carousel-image-full-size carousel-image"} : {"className": "carousel-image carousel-image-margin"})}>
                <h1>Ninth</h1>
            </div>

        </div>

        <a className={'image-switch-anchor'} onClick={(event) => switchImageOnClick(1, event)}>Next</a>
    </div>)
}