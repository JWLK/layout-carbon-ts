import React, { FC, useEffect, useMemo, useState } from 'react'

interface Props {
    draws: ObjSquare[]
    currentPartIndex: number
    setCurrentPartIndex: (flag: number) => void
}

/*IMPORT*/
import { useGlobal } from '@hooks/useGlobal'
import { ObjPoint, ObjSquare } from '@typings/object'
import Square from '@objects/Element/Square'
import Guide from '@objects/Element/Guide'

/*CONSTANT*/
let INIT_CENTER: ObjPoint = { x: 0, y: 2000 }

let LINE_COLOR = '#aaa'
let LINE_COLOR_ACTIVE = '#fff'
let LINE_WIDTH = 0
let LINE_WIDTH_ACTIVE = 0

const GUIDE_ENABLE = false
let GUIDE_MARGIN = 0
const GUIDE_POSITION = 'positive'
let GUIDE_COLOR = '#aaa'
let GUIDE_LINE_WIDTH = 0
let GUIDE_TEXT_SIZE = 0

let TOTAL_GUIDE_POINT: ObjPoint[] = [INIT_CENTER, { x: 0, y: 0 }]
let TOTAL_GUIDE_MARGIN = 0
const TOTAL_GUIDE_POSITION = 'positive'
let TOTAL_GUIDE_COLOR = '#ffff00'
let TOTAL_GUIDE_LINE_WIDTH = 0
let TOTAL_GUIDE_TEXT_SIZE = 0

const View: FC<Props> = ({ draws, currentPartIndex, setCurrentPartIndex }) => {
    /*Size Check*/
    const { windowWidth, windowHeight } = useGlobal()
    /*VIEW BOX*/
    const [viewHeight, setViewHeight] = useState(0)
    const [viewWidth, setViewWidth] = useState(0)
    const [viewCenterMarginX, setViewCenterMarginX] = useState(0)
    const [viewCenterMarginY, setViewCenterMarginY] = useState(0)
    // if (totalHeight / 3 > draws[0].bottom) {
    //     viewHeight = totalHeight * 1.1
    //     viewWidth = (viewHeight / 3) * 2
    // } else {
    //     viewWidth = draws[0].bottom * 2.5
    //     viewHeight = (viewWidth / 2) * 3
    // }
    useEffect(() => {
        if (windowWidth > 1000) {
            if (windowHeight > 1000) {
                setViewHeight(450)
            } else {
                setViewHeight(windowHeight > 600 ? windowHeight * 0.45 : 270)
            }
        } else {
            setViewHeight(270)
        }

        setViewWidth(320)
        setViewCenterMarginX(-viewWidth * 0.5)
        setViewCenterMarginY(-viewHeight)
        console.log(windowHeight)
    }, [windowWidth, windowHeight, viewWidth, viewHeight])

    //LINE SETTING
    LINE_WIDTH = viewWidth * 0.001
    LINE_WIDTH_ACTIVE = LINE_WIDTH * 3

    return (
        <svg viewBox={`${viewCenterMarginX} ${viewCenterMarginY} ${viewWidth} ${viewHeight}`}>
            {/* View Guide */}
            <Square
                center={{ x: 0, y: 0 }}
                draw={{ top: 319, bottom: 319, height: viewHeight }}
                lineColor={LINE_COLOR}
                lineWidth={LINE_WIDTH}
                guideEnable={GUIDE_ENABLE}
                guideTextSize={GUIDE_TEXT_SIZE}
            />
        </svg>
    )
}

export default View
