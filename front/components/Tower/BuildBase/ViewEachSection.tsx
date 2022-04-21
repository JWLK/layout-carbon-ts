import React, { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router'

//Request
import useSWR from 'swr'
import fetchStore from '@utils/store'

import { Fade32, SettingsCheck32 } from '@carbon/icons-react'
import {
    Grid,
    Row,
    Column,
    Tile,
    AspectRatio,
    Accordion,
    AccordionItem,
    ContentSwitcher,
    Switch,
    ButtonSet,
    Button,
    Toggle,
    TextInput,
    NumberInput,
    Slider,
    FormGroup,
    RadioButtonGroup,
    RadioButton,
    Dropdown,
    Tabs,
    Tab,
    DataTable,
    TableContainer,
    Table,
    TableHead,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    ProgressIndicator,
    ProgressStep,
    FluidForm,
    Form,
    Select,
    SelectItem,
} from 'carbon-components-react'

//CSS
import {
    PageTypeWide,
    Header,
    Section,
    SectionDivider,
    InfoText,
} from '@pages/Common/ContentsLayout/styles'

/*Tower Element*/
//Type
import {
    ObjPoint,
    ObjSquare,
    TWInitialValue,
    TWRawData,
    TWSection,
    TWParts,
    TWPart,
    TWFlanges,
    ObjFlange,
} from 'typings/object'
//Data
import { RawData } from '@objects/Data/InitValue'

/*Element*/
import { toRadian, toAngle } from '@objects/Tools/Cartesian'

//Model
import EachSection from '@objects/Tower/Sections/EachSection'
import EachPart from '@objects/Tower/Parts/EachPart'
import EachPartCircle from '@objects/Tower/Parts/EachPartCircle'
import SectorTrancatedScaleUp from '@objects/Tower/Planar/SectorTrancatedScaleUp'
import SectorTC from '@objects/Tower/Planar/SectorTC'
import EachFlangeTypeL from '@objects/Tower/Sections/EachFlangeTypeL'
import EachFlangeTopView from '@objects/Tower/Sections/EachFlangeTopView'

const ViewEachSection = () => {
    /* Param */
    const { workspace } = useParams<{ workspace?: string }>()
    /* Localstorage */
    const keyRawData = `${workspace}-towerData`
    if (localStorage.getItem(keyRawData) === null) {
        localStorage.setItem(keyRawData, JSON.stringify(RawData))
    }
    /* SWR */
    const { data: TD, mutate } = useSWR<TWRawData>(keyRawData, fetchStore)

    /*
     ** Init Tab
     */
    const [rawData, setRawData] = useState({} as TWRawData)
    const [initData, setInitData] = useState({} as TWInitialValue)
    const [sectionData, setSectionData] = useState([] as TWSection[])
    const [partsData, setPartsData] = useState([] as TWParts[])
    const [flangeData, setFlangeData] = useState([] as TWFlanges[])

    /*Selected Section Index State*/
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0)

    const onChaneSelectedIndex = useCallback(
        (value) => {
            setCurrentSectionIndex(value)
            setDivided(partsData[value].divided)
        },
        [partsData],
    )

    useEffect(() => {
        sectionData.map((v, index) => {
            if (index == currentSectionIndex) {
                // setScaleViewBox(onChangeScale(v.section.height))
            }
        })
    }, [currentSectionIndex, initData.totalHeight, sectionData])

    /*Setting State*/
    const [divided, setDivided] = useState(1)

    const onChangeDevided = useCallback((e) => {
        setDivided(e.value)
    }, [])

    const onClickSetPartsData = useCallback(
        (e) => {
            e.preventDefault()
            setCurrentPartIndex(0)
            var partObject = [] as TWPart[]
            var flangeObject = {} as TWFlanges
            var totalHeight = sectionData[currentSectionIndex].section.height
            var topUpperOutDia = sectionData[currentSectionIndex].section.top
            var bottomLowerOutDia = sectionData[currentSectionIndex].section.bottom

            for (var i = 0; i < divided; i++) {
                /* Init Value */
                var eachHeight = Math.round(totalHeight / divided)
                var triBottom = Math.abs(topUpperOutDia - bottomLowerOutDia) / 2
                var eachHypo =
                    Math.sqrt(Math.pow(triBottom, 2) + Math.pow(totalHeight, 2)) / divided
                var radian = Math.PI / 2 - Math.atan(totalHeight / triBottom)

                // console.log('eachHeight', eachHeight)
                // console.log('triBottom', triBottom)
                // console.log('eachHypo', eachHypo)
                // console.log('angle', (180 / Math.PI) * angle)

                /* Calc Value */
                var sectionWidthTop = Math.round(
                    topUpperOutDia + eachHypo * i * Math.sin(radian) * 2,
                )
                var sectionWidthBottom = Math.round(
                    topUpperOutDia + eachHypo * (i + 1) * Math.sin(radian) * 2,
                )
                // console.log(
                //     `sectionWidthTop : ${sectionWidthTop} / sectionWidthBottom : ${sectionWidthBottom}`,
                // )

                //Inser Reverse
                partObject[divided - 1 - i] = {
                    index: i,
                    part: {
                        top: sectionWidthTop,
                        bottom: sectionWidthBottom,
                        height: eachHeight,
                    },
                    thickness: 50,
                }
            }
            /* Calc Flange Value */
            flangeObject = {
                index: currentSectionIndex,
                flange: [
                    {
                        outDia: sectionData[currentSectionIndex].section.bottom,
                        inDia: sectionData[currentSectionIndex].section.bottom - 2 * 400, //= outDia - 2 * flangeWidth
                        flangeWidth: 400,
                        flangeHeight: 200,
                        neckWidth: 50,
                        neckHeight: 100,
                        minScrewWidth: 80,
                        pcDia: sectionData[currentSectionIndex].section.bottom - 2 * 50 - 2 * 80, // = outDia - 2 * neckWidth - 2 * minScrewWidth
                        param_a:
                            (sectionData[currentSectionIndex].section.bottom -
                                2 * 50 -
                                2 * 80 -
                                (sectionData[currentSectionIndex].section.bottom - 2 * 400)) /
                            2,
                        param_b:
                            (sectionData[currentSectionIndex].section.bottom -
                                50 -
                                (sectionData[currentSectionIndex].section.bottom -
                                    2 * 50 -
                                    2 * 80)) /
                            2,
                        screwWidth: 64,
                        screwNumberOf: 150,
                    },
                    {
                        outDia: sectionData[currentSectionIndex].section.top,
                        inDia: sectionData[currentSectionIndex].section.top - 2 * 400, //= outDia - 2 * flangeWidth
                        flangeWidth: 400,
                        flangeHeight: 200,
                        neckWidth: 50,
                        neckHeight: 100,
                        minScrewWidth: 80,
                        pcDia: sectionData[currentSectionIndex].section.top - 2 * 50 - 2 * 80, // = outDia - 2 * neckWidth - 2 * minScrewWidth
                        param_a:
                            (sectionData[currentSectionIndex].section.bottom -
                                2 * 50 -
                                2 * 80 -
                                (sectionData[currentSectionIndex].section.bottom - 2 * 400)) /
                            2,
                        param_b:
                            (sectionData[currentSectionIndex].section.bottom -
                                50 -
                                (sectionData[currentSectionIndex].section.bottom -
                                    2 * 50 -
                                    2 * 80)) /
                            2,
                        screwWidth: 64,
                        screwNumberOf: 150,
                    },
                ],
            }

            rawData.partsData[currentSectionIndex].divided = divided
            rawData.partsData[currentSectionIndex].parts = partObject
            rawData.flangeData[currentSectionIndex] = flangeObject
            localStorage.setItem(keyRawData, JSON.stringify(rawData))

            //개별 업데이터
            // setRawData(rawData)
            // setSectionData(sectionsObject)

            //한번에 업데이터
            mutate()
        },
        [sectionData, currentSectionIndex, divided, rawData, keyRawData, mutate],
    )

    /*Each Part Select Event Option */
    /*Selected Section Index State*/
    const [currentPartIndex, setCurrentPartIndex] = useState(0)
    useEffect(() => {
        if (partsData.length) {
            setThinckness(partsData[currentSectionIndex].parts[currentPartIndex].thickness)
        }
    }, [currentPartIndex, currentSectionIndex, partsData])

    /*Each Part Thickness <Setting></Setting>/*Setting State*/
    const [thinckness, setThinckness] = useState(1)

    const onChangeThickness = useCallback(
        (e) => {
            partsData[currentSectionIndex].parts[currentPartIndex].thickness = e.value
            if (currentPartIndex == 0) {
                updateFlangeThicknessSync(e.value)
            }
            rawData.partsData = partsData
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
            mutate()
        },
        [currentPartIndex, currentSectionIndex, keyRawData, partsData, rawData],
    )
    /* Flange Data Update*/
    const updateFlangeThicknessSync = (thickness: number) => {
        flangeData[currentSectionIndex].flange[0].neckWidth = thickness
        flangeData[currentSectionIndex].flange[0].pcDia =
            flangeData[currentPartIndex].flange[0].outDia -
            2 * thickness -
            2 * flangeData[currentPartIndex].flange[0].minScrewWidth
        flangeData[currentPartIndex].flange[0].param_a =
            (flangeData[currentPartIndex].flange[0].pcDia -
                flangeData[currentPartIndex].flange[0].inDia) /
            2
        flangeData[currentPartIndex].flange[0].param_b =
            (flangeData[currentPartIndex].flange[0].outDia -
                flangeData[currentPartIndex].flange[0].neckWidth -
                flangeData[currentPartIndex].flange[0].pcDia) /
            2
        rawData.flangeData[currentSectionIndex] = flangeData[currentSectionIndex]
        localStorage.setItem(keyRawData, JSON.stringify(rawData))
        mutate()
    }

    /* Mode Swicher */
    const [modeSwicher, setModeSwicher] = useState('part')
    const onChangeModeSwitcher = useCallback((e) => {
        setModeSwicher(e.name)
    }, [])

    /* Table OnChange Event Controller*/

    //
    /* Table Section*/
    //
    type typeObjSquare = 'top' | 'bottom' | 'height'
    const onChangePartsData = useCallback(
        (e, selectedIndex) => {
            console.log(e.target.name, selectedIndex)
            const parts = partsData[currentSectionIndex].parts.map((v, index) => {
                const typeObject: typeObjSquare = e.target.name
                if (index === selectedIndex) {
                    v.part[`${typeObject}`] = parseInt(e.target.value !== '' ? e.target.value : 0)
                }
                return v
            })

            // const updateInitial = updateInitialSync(section)
            // const updateParts = updatePartsTaperedSync(section)

            localStorage.setItem(keyRawData, JSON.stringify(updateRawDatadSyncWithParts(parts)))
            mutate()
        },
        [currentSectionIndex, keyRawData, mutate, partsData, rawData],
    )

    const updateRawDatadSyncWithParts = (parts: TWPart[]) => {
        var totalHeight = 0
        var sectionHeight = 0

        for (var i = 0; i < partsData[currentSectionIndex].parts.length; i++) {
            sectionHeight += partsData[currentSectionIndex].parts[i].part.height
        }
        sectionData[currentSectionIndex].section.height = sectionHeight

        for (var l = 0; l < sectionData.length; l++) {
            totalHeight += sectionData[l].section.height
        }
        initData.totalHeight = totalHeight

        rawData.initial = initData
        rawData.sectionData = sectionData
        rawData.partsData[currentSectionIndex].parts = parts

        return rawData
    }

    //
    /* Table Section*/
    //
    type typeObjFlange =
        | 'outDia'
        | 'inDia'
        | 'flangeWidth'
        | 'flangeHeight'
        | 'neckWidth'
        | 'neckHeight'
        | 'minScrewWidth'
        | 'pcDia'
        | 'param_a'
        | 'param_b'
        | 'screwNumberOf'
    const onChangeFlnageData = useCallback(
        (e, selectedIndex) => {
            console.log(e.target.name, selectedIndex, currentSectionIndex)
            console.log('flangeData', flangeData[currentSectionIndex])
            const flange = flangeData[currentSectionIndex].flange.map((v, index) => {
                const typeObject: typeObjFlange = e.target.name
                if (index === selectedIndex) {
                    v[`${typeObject}`] = parseInt(e.target.value !== '' ? e.target.value : 0)
                    if (typeObject == 'neckWidth') {
                        v.pcDia =
                            v.outDia -
                            2 * parseInt(e.target.value !== '' ? e.target.value : 0) -
                            2 * v.minScrewWidth
                        v.param_a = (v.pcDia - v.inDia) / 2
                        v.param_b = (v.outDia - v.neckWidth - v.pcDia) / 2
                    } else if (typeObject == 'minScrewWidth') {
                        v.pcDia =
                            v.outDia -
                            2 * v.neckWidth -
                            2 * parseInt(e.target.value !== '' ? e.target.value : 0)
                        v.param_a = (v.pcDia - v.inDia) / 2
                        v.param_b = (v.outDia - v.neckWidth - v.pcDia) / 2
                    } else if (typeObject == 'flangeWidth') {
                        v.inDia = v.outDia - v.flangeWidth * 2
                        v.param_a = (v.pcDia - v.inDia) / 2
                    }
                }
                return v
            })
            console.log('flanges', flange)
            localStorage.setItem(keyRawData, JSON.stringify(updateRawDatadSyncWithFlange(flange)))
            mutate()
        },
        [currentSectionIndex, flangeData, keyRawData],
    )

    const updateRawDatadSyncWithFlange = (flanges: ObjFlange[]) => {
        //Out Diameter => part
        // partsData[currentSectionIndex].parts[0].part.bottom = flanges[0].outDia
        // partsData[currentSectionIndex].parts[partsData.length - 1].part.top = flanges[1].outDia
        partsData[currentSectionIndex].parts[0].thickness = flanges[0].neckWidth
        // partsData[currentSectionIndex].parts[partsData.length - 1].thickness = flanges[1].neckWidth

        rawData.initial = initData
        rawData.sectionData = sectionData
        rawData.partsData[currentSectionIndex] = partsData[currentSectionIndex]
        rawData.flangeData[currentSectionIndex].flange = flanges

        return rawData
    }

    /*
    ** Data Renewal
    *
    SWR를 활용하여 LocalStorage 데이터를 반영해 useState의 Value를 최신으로 업데이트
    onChange를 통해 useState, LocalStorage 1차 저장(useState == LocalStorage -> 선택적으로 자동저장 활용)
    [Server 반영 방법]
    - useState : set() Method를 이용해서 개별적인 데이터 업데이트
    - SWR : mutate() => useEffect(~, [TD])를 통해 useState Value를 최신데이터로 업데이트해 Front에 반영
    [Front 표현]
    - useState : object를 이용해서 데이터 반영
    */
    useEffect(() => {
        if (TD !== undefined) {
            // console.log(TD)
            setRawData(TD)
            setInitData(TD.initial)
            setSectionData(TD.sectionData)
            setPartsData(TD.partsData)
            setFlangeData(TD.flangeData)
            setDivided(TD.partsData[currentSectionIndex].divided)
            setThinckness(TD.partsData[currentSectionIndex].parts[currentPartIndex].thickness)
        }
    }, [TD])

    if (TD === undefined) {
        return <div>Loading...</div>
    }

    const headersPart = [
        {
            key: 'no',
            header: 'Part No.',
        },
        {
            key: 'height',
            header: 'Length Lᵢ',
        },
        {
            key: 'thickness',
            header: 'Thickness tᵢ',
        },
        {
            key: 'top-out',
            header: 'Upper outside diameter Dᴏ,ɪ_ᴜᴘʀ',
        },
        {
            key: 'top-in',
            header: 'Upper inside diameter Dɪ,ɪ_ᴜᴘʀ',
        },
        {
            key: 'bottom-out',
            header: 'Lower outside diameter Dᴏ,ɪ_ʟᴘʀ',
        },
        {
            key: 'bottom-in',
            header: 'Lower inside diameter Dɪ,ɪ_ʟᴘʀ',
        },
    ]

    const headersFlangeMain = [
        {
            key: 'type',
            header: 'Type',
        },
        {
            key: 'position',
            header: 'Position',
        },
        {
            key: 'outDia',
            header: 'Outside Diameter dₒ',
        },
        {
            key: 'inDia',
            header: 'Inside Diameter dᵢ',
        },
        {
            key: 'flangeWidth',
            header: 'Width of Flange b_fi',
        },
        {
            key: 'flangeHeight',
            header: 'Height of Flange t_fi',
        },
        {
            key: 'neckHeight',
            header: 'Height of Neck tₜ',
        },
        {
            key: 'neckWidth',
            header: 'Thickness of neck tₛ',
        },
    ]

    const headersFlangeScrew = [
        {
            key: 'type',
            header: 'Type',
        },
        {
            key: 'position',
            header: 'Position',
        },
        {
            key: 'minScrewWidth',
            header: 'Minimum screws a_min',
        },
        {
            key: 'pcDia',
            header: 'Pitch Circle Diameter',
        },
        {
            key: 'param_a',
            header: 'a',
        },
        {
            key: 'param_b',
            header: 'b',
        },
        {
            key: 'screwWidth',
            header: 'Screw Size',
        },
        {
            key: 'screwNumberOf',
            header: 'Number of Screw',
        },
    ]

    const headersResult = [
        {
            key: 'no',
            header: 'Part No.',
        },
        {
            key: 'height',
            header: 'Length Lᵢ',
        },
        {
            key: 'thickness',
            header: 'Thickness tᵢ',
        },
        {
            key: 'top-out',
            header: 'Upper outside diameter Dᴏ,ɪ_ᴜᴘʀ',
        },
        {
            key: 'top-in',
            header: 'Upper outside diameter Dɪ,ɪ_ᴜᴘʀ',
        },
        {
            key: 'bottom-out',
            header: 'Lower outside diameter Dᴏ,ɪ_ʟᴘʀ',
        },
        {
            key: 'bottom-in',
            header: 'Lower inside diameter Dɪ,ɪ_ʟᴘʀ',
        },
        {
            key: 'weight',
            header: 'Weight mᵢ',
        },
        {
            key: 'sector-angle',
            header: 'Arc Angle θᵢ (Degree)',
        },
        {
            key: 'top-sector',
            header: 'Upper Arc Sₒₐᵢ',
        },
        {
            key: 'bottom-sector',
            header: 'Upper Arc Sᵤₐᵢ',
        },
        {
            key: 'sheet-origin',
            header: 'Sheet Origin Wₒᵣᵢ',
        },
        {
            key: 'sheet-margin',
            header: 'Sheet Margin δ',
        },
        {
            key: 'sheet-result',
            header: 'Sheet Result W_sheet',
        },
    ]

    return (
        <>
            {partsData.length && (
                <>
                    {/*  */}
                    {/*  */}
                    {/* Section Progress & Change Zone*/}
                    {/*  */}
                    {/*  */}
                    <ProgressIndicator
                        currentIndex={currentSectionIndex}
                        onChange={onChaneSelectedIndex}
                    >
                        {partsData.map((v, index) => (
                            <ProgressStep label={`SECTION ${sectionData.length - index}`} />
                        ))}
                    </ProgressIndicator>
                    <SectionDivider />
                    {/*  */}
                    {/*  */}
                    {/* Contents Mode Swicher Zone*/}
                    {/*  */}
                    {/*  */}
                    <Row
                        style={{
                            marginBlock: '1.5rem',
                            paddingInline: '1rem',
                            paddingBlock: '1rem',
                        }}
                        narrow
                    >
                        <ContentSwitcher
                            selectedIndex={0}
                            size="xl"
                            onChange={onChangeModeSwitcher}
                        >
                            <Switch name={'part'} text="Part" />
                            <Switch name={'flange'} text="Flange" />
                            <Switch name={'result'} text="Result " />
                        </ContentSwitcher>
                    </Row>
                    {/*  */}
                    {/*  */}
                    {/* Graphic Zone*/}
                    {/*  */}
                    {/*  */}

                    {modeSwicher !== 'result' ? (
                        <Row as="article">
                            {/*  */}
                            {/* LEFT TOWER Zone*/}
                            {/*  */}
                            <Column sm={4} md={8} lg={6} xlg={4}>
                                <Row
                                    style={{
                                        border: '1px solid #333',
                                        marginBlock: '0.5rem',
                                        padding: '1.5rem',
                                    }}
                                    narrow
                                >
                                    <Slider
                                        id="initial-divided"
                                        labelText="Number of Tower Part"
                                        max={20}
                                        min={1}
                                        step={1}
                                        value={divided}
                                        onChange={onChangeDevided}
                                    />
                                    <Button
                                        renderIcon={SettingsCheck32}
                                        onClick={onClickSetPartsData}
                                    >
                                        Set Parts
                                    </Button>
                                    <SectionDivider />
                                    <EachSection
                                        draws={partsData[currentSectionIndex].parts.map(
                                            (v) => v.part,
                                        )}
                                        currentPartIndex={currentPartIndex}
                                        setCurrentPartIndex={setCurrentPartIndex}
                                    />
                                </Row>
                            </Column>

                            {/*  */}
                            {/* RIGHT Part Detail View Zone */}
                            {/*  */}
                            {modeSwicher == 'part' ? (
                                <>
                                    {/*  */}
                                    {/*  */}
                                    {/* MODE PART */}
                                    {/*  */}
                                    {/*  */}
                                    <Column sm={4} md={8} lg={6} xlg={8}>
                                        {/* RIGHT 1 Sector View Zone */}
                                        <Row
                                            style={{
                                                borderTop: '1px solid #333',
                                                marginBlock: '0.5rem',
                                                paddingInline: '1rem',
                                                paddingTop: '1.5rem',
                                            }}
                                            narrow
                                        >
                                            <Column
                                                sm={4}
                                                md={8}
                                                lg={12}
                                                xlg={4}
                                                style={{
                                                    border: '1px solid #333',
                                                    padding: '1.5rem',
                                                }}
                                            >
                                                <div style={{ marginBottom: '1rem' }}>
                                                    {`Part No. : ${currentPartIndex + 1}`}
                                                </div>
                                                <EachPart
                                                    draws={partsData[currentSectionIndex].parts.map(
                                                        (v) => v.part,
                                                    )}
                                                    currentPartIndex={currentPartIndex}
                                                />
                                            </Column>

                                            <Column
                                                sm={4}
                                                md={8}
                                                lg={12}
                                                xlg={8}
                                                style={{
                                                    border: '1px solid #333',
                                                    padding: '1.5rem',
                                                }}
                                            >
                                                <div style={{ marginBottom: '1rem' }}>
                                                    Planar View
                                                </div>
                                                <SectorTC
                                                    top={
                                                        partsData[currentSectionIndex].parts[
                                                            currentPartIndex
                                                        ].part.top
                                                    }
                                                    bottom={
                                                        partsData[currentSectionIndex].parts[
                                                            currentPartIndex
                                                        ].part.bottom
                                                    }
                                                    height={
                                                        partsData[currentSectionIndex].parts[
                                                            currentPartIndex
                                                        ].part.height
                                                    }
                                                />
                                            </Column>
                                        </Row>

                                        {/* RIGHT 2 Part Parameter  */}
                                        <Row
                                            style={{
                                                marginBlock: '0.5rem',
                                                paddingInline: '1rem',
                                                paddingTop: '0.5rem',
                                            }}
                                            narrow
                                        >
                                            {/*  */}
                                            {/* RIGHT 2 Thickness */}
                                            {/*  */}
                                            <Column
                                                sm={4}
                                                md={8}
                                                lg={12}
                                                xlg={4}
                                                style={{
                                                    border: '1px solid #333',
                                                    padding: '1.5rem',
                                                }}
                                            >
                                                <div style={{ marginBottom: '1rem' }}>
                                                    Thickness
                                                </div>
                                                <Slider
                                                    id="select-part-thickness"
                                                    labelText={`Part No. ${
                                                        currentPartIndex + 1
                                                    } of Thickness (mm)`}
                                                    max={100}
                                                    min={1}
                                                    step={1}
                                                    value={thinckness}
                                                    onChange={onChangeThickness}
                                                />
                                                <br />
                                                <EachPartCircle
                                                    draw={
                                                        partsData[currentSectionIndex].parts[
                                                            currentPartIndex
                                                        ].part
                                                    }
                                                    viewSelect={'top'}
                                                    thinckness={thinckness}
                                                />
                                            </Column>

                                            {/*  */}
                                            {/* RIGHT 2 Thickness */}
                                            {/*  */}
                                            <Column
                                                sm={4}
                                                md={8}
                                                lg={12}
                                                xlg={8}
                                                style={{
                                                    border: '1px solid #333',
                                                    padding: '1.5rem',
                                                }}
                                            >
                                                <div style={{ marginBottom: '1rem' }}>
                                                    Parameter
                                                </div>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            {headersPart.map((header) => (
                                                                <TableHeader
                                                                    key={header.key}
                                                                    style={{
                                                                        textAlign: 'start',
                                                                    }}
                                                                >
                                                                    {header.header}
                                                                </TableHeader>
                                                            ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {partsData[currentSectionIndex].parts
                                                            .slice(0)
                                                            .reverse()
                                                            .map((v, index) => (
                                                                <TableRow
                                                                    key={`section-${index}`}
                                                                    style={{
                                                                        textAlign: 'end',
                                                                    }}
                                                                >
                                                                    <TableCell>
                                                                        {partsData[
                                                                            currentSectionIndex
                                                                        ].divided - index}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <TextInput
                                                                            id={`section-height-${index}`}
                                                                            labelText=""
                                                                            name="height"
                                                                            onChange={(e) =>
                                                                                onChangePartsData(
                                                                                    e,
                                                                                    divided -
                                                                                        index -
                                                                                        1,
                                                                                )
                                                                            }
                                                                            value={v.part.height}
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <TextInput
                                                                            id={`section-thickness-${index}`}
                                                                            labelText=""
                                                                            name="thickness"
                                                                            onChange={(e) =>
                                                                                onChangePartsData(
                                                                                    e,
                                                                                    divided -
                                                                                        index -
                                                                                        1,
                                                                                )
                                                                            }
                                                                            value={v.thickness}
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        {v.part.top}
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        {v.part.top -
                                                                            v.thickness * 2}
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        {v.part.bottom}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {v.part.bottom -
                                                                            v.thickness * 2}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            </Column>
                                        </Row>
                                    </Column>
                                </>
                            ) : (
                                <>
                                    {/*  */}
                                    {/*  */}
                                    {/* MODE Flange */}
                                    {/*  */}
                                    {/*  */}
                                    <Column sm={4} md={8} lg={6} xlg={8}>
                                        {/* RIGHT 1 Flange View Zone */}
                                        <Row
                                            style={{
                                                borderTop: '1px solid #333',
                                                marginBlock: '0.5rem',
                                                paddingInline: '1rem',
                                                paddingTop: '1.5rem',
                                            }}
                                            narrow
                                        >
                                            {/*  */}
                                            {/* RIGHT 1 Flange Side View */}
                                            {/*  */}
                                            <Column
                                                sm={4}
                                                md={8}
                                                lg={12}
                                                xlg={6}
                                                style={{
                                                    border: '1px solid #333',
                                                    padding: '1.5rem',
                                                }}
                                            >
                                                <div
                                                    style={{ marginBottom: '1rem' }}
                                                >{`Side View - Flange Type L `}</div>

                                                {/* <EachPart
                                                draws={partsData[currentSectionIndex].parts.map(
                                                    (v) => v.part,
                                                )}
                                                currentPartIndex={currentPartIndex}
                                            /> */}
                                                <EachFlangeTypeL
                                                    flanges={flangeData[currentSectionIndex].flange}
                                                    currentFlange={0}
                                                />
                                            </Column>

                                            {/*  */}
                                            {/* RIGHT 1 Flange Top View */}
                                            {/*  */}
                                            <Column
                                                sm={4}
                                                md={8}
                                                lg={12}
                                                xlg={6}
                                                style={{
                                                    border: '1px solid #333',
                                                    padding: '1.5rem',
                                                }}
                                            >
                                                <div
                                                    style={{ marginBottom: '1rem' }}
                                                >{`Top View `}</div>
                                                <EachFlangeTopView
                                                    flanges={flangeData[currentSectionIndex].flange}
                                                    currentFlange={0}
                                                />
                                            </Column>
                                        </Row>

                                        {/* RIGHT 2 Flange Parameter */}
                                        <Row
                                            style={{
                                                marginBlock: '0.5rem',
                                                paddingInline: '1rem',
                                                paddingTop: '0.5rem',
                                            }}
                                            narrow
                                        >
                                            <Column
                                                sm={4}
                                                md={8}
                                                lg={12}
                                                xlg={12}
                                                style={{
                                                    border: '1px solid #333',
                                                    padding: '1.5rem',
                                                }}
                                            >
                                                <div style={{ marginBottom: '1rem' }}>
                                                    {`Body Parameter`}
                                                </div>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            {headersFlangeMain.map((header) => (
                                                                <TableHeader
                                                                    key={header.key}
                                                                    style={{
                                                                        textAlign: 'start',
                                                                    }}
                                                                >
                                                                    {header.header}
                                                                </TableHeader>
                                                            ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {flangeData[currentSectionIndex].flange.map(
                                                            (v, index) => {
                                                                if (index == 0) {
                                                                    return (
                                                                        <TableRow
                                                                            key={`section-${index}`}
                                                                            style={{
                                                                                textAlign: 'end',
                                                                            }}
                                                                        >
                                                                            <TableCell>{`Body`}</TableCell>
                                                                            <TableCell>
                                                                                {index === 0
                                                                                    ? 'Lower'
                                                                                    : 'Upper'}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {v.outDia}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {v.inDia}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <TextInput
                                                                                    id={`flange-flangeWidth-${index}`}
                                                                                    labelText=""
                                                                                    name="flangeWidth"
                                                                                    value={
                                                                                        v.flangeWidth
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        onChangeFlnageData(
                                                                                            e,
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <TextInput
                                                                                    id={`flange-flangeHeight-${index}`}
                                                                                    labelText=""
                                                                                    name="flangeHeight"
                                                                                    value={
                                                                                        v.flangeHeight
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        onChangeFlnageData(
                                                                                            e,
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <TextInput
                                                                                    id={`flange-neckHeight-${index}`}
                                                                                    labelText=""
                                                                                    name="neckHeight"
                                                                                    value={
                                                                                        v.neckHeight
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        onChangeFlnageData(
                                                                                            e,
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <TextInput
                                                                                    id={`flange-neckWidth-${index}`}
                                                                                    labelText=""
                                                                                    name="neckWidth"
                                                                                    value={
                                                                                        v.neckWidth
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        onChangeFlnageData(
                                                                                            e,
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                }
                                                            },
                                                        )}
                                                    </TableBody>
                                                </Table>

                                                <SectionDivider />

                                                <div style={{ marginBottom: '1rem' }}>
                                                    {`Screw Parameter`}
                                                </div>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            {headersFlangeScrew.map((header) => (
                                                                <TableHeader
                                                                    key={header.key}
                                                                    style={{
                                                                        textAlign: 'start',
                                                                    }}
                                                                >
                                                                    {header.header}
                                                                </TableHeader>
                                                            ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {flangeData[currentSectionIndex].flange.map(
                                                            (v, index) => {
                                                                if (index == 0) {
                                                                    return (
                                                                        <TableRow
                                                                            key={`section-${index}`}
                                                                            style={{
                                                                                textAlign: 'end',
                                                                            }}
                                                                        >
                                                                            <TableCell>{`Screw`}</TableCell>
                                                                            <TableCell>
                                                                                {index === 0
                                                                                    ? 'Lower'
                                                                                    : 'Upper'}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <TextInput
                                                                                    id={`flange-minScrewWidth-${index}`}
                                                                                    labelText=""
                                                                                    name="minScrewWidth"
                                                                                    value={
                                                                                        v.minScrewWidth
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        onChangeFlnageData(
                                                                                            e,
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {v.pcDia}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {v.param_a}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {v.param_b}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <TextInput
                                                                                    id={`flange-screwWidth-${index}`}
                                                                                    labelText=""
                                                                                    name="screwWidth"
                                                                                    value={
                                                                                        v.screwWidth
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        onChangeFlnageData(
                                                                                            e,
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <TextInput
                                                                                    id={`flange-screwNumberOf-${index}`}
                                                                                    labelText=""
                                                                                    name="screwNumberOf"
                                                                                    value={
                                                                                        v.screwNumberOf
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        onChangeFlnageData(
                                                                                            e,
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                }
                                                            },
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </Column>
                                        </Row>
                                    </Column>
                                </>
                            )}
                        </Row>
                    ) : (
                        <Row
                            style={{
                                borderTop: '1px solid #333',
                                marginBlock: '0.5rem',
                                padding: '1.5rem',
                            }}
                            narrow
                        >
                            {/*  */}
                            {/*  */}
                            {/* Parameter Table ZONE */}
                            {/*  */}
                            {/*  */}
                            <>
                                <Column sm={4} md={8} lg={12} xlg={12}>
                                    <InfoText>{`Total Parameter - SECTION ${
                                        sectionData.length - currentSectionIndex
                                    }`}</InfoText>
                                </Column>

                                <Column sm={4} md={8} lg={12} xlg={12}>
                                    <div style={{ marginBottom: '1rem' }}>{`Part Parameter`}</div>
                                </Column>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {headersResult.map((header) => (
                                                <TableHeader
                                                    key={header.key}
                                                    style={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {header.header}
                                                </TableHeader>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {partsData[currentSectionIndex].parts
                                            .slice(0)
                                            .reverse()
                                            .map((v, index) => (
                                                <TableRow
                                                    key={`section-${index}`}
                                                    style={{
                                                        textAlign: 'end',
                                                    }}
                                                >
                                                    <TableCell>
                                                        {partsData[currentSectionIndex].divided -
                                                            index}
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextInput
                                                            id={`section-height-${index}`}
                                                            labelText=""
                                                            name="height"
                                                            onChange={(e) =>
                                                                onChangePartsData(
                                                                    e,
                                                                    divided - index - 1,
                                                                )
                                                            }
                                                            value={v.part.height}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextInput
                                                            id={`section-top-${index}`}
                                                            labelText=""
                                                            name="top"
                                                            value={v.part.top}
                                                            disabled={true}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextInput
                                                            id={`section-bottom-${index}`}
                                                            labelText=""
                                                            name="bottom"
                                                            value={v.part.bottom}
                                                            disabled={true}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </>
                        </Row>
                    )}
                </>
            )}
        </>
    )
}

export default ViewEachSection