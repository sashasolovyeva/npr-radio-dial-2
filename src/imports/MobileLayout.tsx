import svgPaths from "./svg-fdt74110km";
import imgDonateBtn from "figma:asset/86628cdce5b415e2646cf8ff2a982bf6bc2f3b77.png";
import imgScreenshot20240410At1491 from "figma:asset/59c9325ce0d1144cfed82d082df6312c774514ad.png";
import imgComponent from "figma:asset/546d20c15c14ca1a11e4824b5bd7fa942c5ea9dd.png";
import imgImg7635 from "figma:asset/5b21697e0f96a441a22b81fb634adb4461afa6ff.png";
import { imgImg7634 } from "./svg-1f0sw";

function DonateBtn() {
  return (
    <div className="absolute inset-[20%_3.51%_20%_76.51%]" data-name="donate-btn">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[101.13%] left-0 max-w-none top-[-0.57%] w-full" src={imgDonateBtn} />
      </div>
    </div>
  );
}

function HamburgerDropdown() {
  return (
    <div className="absolute inset-[16%_88.37%_14%_3.49%]" data-name="hamburger-dropdown">
      <div className="absolute inset-0 rounded-[6px]">
        <div aria-hidden="true" className="absolute border border-[#dfdfdf] border-solid inset-0 pointer-events-none rounded-[6px]" />
      </div>
      <div className="absolute inset-[25.71%_22.86%_28.57%_22.86%]" data-name="Screenshot 2024-04-10 at 1.49 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgScreenshot20240410At1491} />
      </div>
    </div>
  );
}

function NprLogoColor() {
  return (
    <div className="absolute inset-[26%_68.14%_26.93%_15.12%]" data-name="npr-logo-color">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 72 24">
        <g id="npr-logo-color">
          <path d="M24 0H0V23.5358H24V0Z" fill="var(--fill-0, #D62021)" id="Vector" />
          <path d="M72 0H48V23.5358H72V0Z" fill="var(--fill-0, #237BBD)" id="Vector_2" />
          <path d={svgPaths.p3d130180} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.p17655870} fill="var(--fill-0, white)" id="Vector_4" />
          <path d="M48 0H24V23.5358H48V0Z" fill="var(--fill-0, black)" id="Vector_5" />
          <path d={svgPaths.p119f9c00} fill="var(--fill-0, white)" id="Vector_6" />
        </g>
      </svg>
    </div>
  );
}

function Component() {
  return (
    <div className="absolute inset-[26%_51.43%_26%_35.35%]" data-name="Component">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgComponent} />
    </div>
  );
}

function MobileNav() {
  return (
    <div className="h-[50px] relative shrink-0 w-[430px]" data-name="mobile-nav">
      <div className="absolute bg-white inset-0">
        <div aria-hidden="true" className="absolute border-[#dfdfdf] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      </div>
      <DonateBtn />
      <HamburgerDropdown />
      <NprLogoColor />
      <Component />
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[15px] relative size-full">
          <div className="basis-0 bg-[#d9d9d9] grow h-full min-h-px min-w-px shrink-0" />
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] h-[927.995px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-10px_820.663px] mask-size-[450px_121px] ml-0 mt-[-826.66px] relative w-[430px]" data-name="IMG_7634" style={{ maskImage: `url('${imgImg7634}')` }}>
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImg7635} />
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="relative shrink-0 size-[287px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 287 287">
        <g id="Group 1052">
          <path d={svgPaths.pe41a600} fill="var(--fill-0, #7783B9)" id="Exclude" />
          <path d={svgPaths.p2f237780} fill="var(--fill-0, #B9779C)" id="Exclude_2" />
          <path d={svgPaths.p33689a00} fill="var(--fill-0, #98B977)" id="Exclude_3" />
        </g>
      </svg>
    </div>
  );
}

function ArrowBackIos() {
  return (
    <div className="relative size-[24px]" data-name="arrow/back/ios">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="arrow/back/ios">
          <path d={svgPaths.pd0caf00} fill="var(--fill-0, #333333)" id="icon/navigation/arrow_back_ios_24px" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-[#c9d8ec] box-border content-stretch flex gap-[10px] items-center left-[69px] px-[37px] py-[22px] top-[65px]">
      <Group1 />
      <div className="absolute flex items-center justify-center left-0 size-[24px] top-[calc(50%+0.5px)] translate-y-[-50%]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <ArrowBackIos />
        </div>
      </div>
    </div>
  );
}

export default function MobileLayout() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full" data-name="mobile-layout">
      <MobileNav />
      <Frame1 />
      <Group />
      <Frame />
    </div>
  );
}