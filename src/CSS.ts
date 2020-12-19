import {CSSProperties} from "react";

const gray = "#d3d3d3";
const lightGray = "#e3e3e3";

export class CSS {
	public static userList: CSSProperties = {margin: 10, padding: 10, backgroundColor: lightGray};
	public static userName: CSSProperties = {margin: 5, padding: 5, backgroundColor: gray, fontSize: "16pt"};
	public static actionsContainer: CSSProperties = {margin: 5, padding: 5};
	public static actionButton: CSSProperties = {margin: 5};
	public static chart: CSSProperties = {margin: 10, padding: 10, backgroundColor: lightGray};
	public static hGroup: CSSProperties = {display: "flex", flexDirection: "row"};
	public static vGroup: CSSProperties = {display: "flex", flexDirection: "column"};
}
