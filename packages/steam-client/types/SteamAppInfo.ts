import { Validator } from "jsonschema";
import { definitions } from "./schema.json";

type OsArch = 64 | 32 | "";

type Config = {
	oslist?: "windows" | "macos" | "linux" | string;
	osarch?: OsArch;
	ownsdlc?: number;
	language?: string;
	realm?: "steamglobal" | "steamchina";
	betakey?: string;
	optionaldlc?: number;
	steamdeck?: 0;
};

type LocalizedString = {
	[key: string]: string;
};

type LogoPosition = {
	pinned_position:
		| "UpperLeft"
		| "UpperCenter"
		| "UpperRight"
		| ""
		| "CenterCenter"
		| ""
		| "BottomLeft"
		| "BottomCenter"
		| "BottomRight";
	width_pct: number;
	height_pct: number;
};

/**
 * This type is intended to be used by the decoded buffer from the CMsgClientPICSProductInfoResponse message
 */
export type SteamAppInfo = {
	appid: number;
	public_only?: 1;

	common: {
		name: string;
		type: "Game" | "DLC" | "Tool";
		parent?: number;
		releasestate?: "released" | "prerelease";
		oslist?: string;
		osarch?: OsArch;

		requireskbmouse?: 1;

		controllervr?: {
			steamvr?: 1;
			oculus?: 1;
			xinput?: 1;
			kbm?: 1;
		};

		playareavr?: {
			seated?: 1;
			standing?: 1;
			roomscale?: {
				width: number;
				depth: number;
				"360_required": 0;
			};
		};

		openvr_action_manifest_path?: string;
		openxrsupport?: 1;
		openvrsupport?: 1;
		othervrsupport?: 1;
		othervrsupport_rift_13?: 1;

		aicontenttype?: number;

		logo?: string;
		logo_small?: string;

		restricted_countries?: string;

		icon?: string;

		openvr_controller_bindings?: {
			[key: `${number}`]: {
				controller_type: string;
				url: string;
			};
		};

		clienttga?: string;
		clienticon?: string;
		clienticns?: string;
		linuxclienticon?: string;

		steamchinaapproved?: 1;
		releasestatesteamchina?: "released";

		timeline_marker_updated?: number;
		timeline_marker_svg?: string;

		market_presence?: 1;

		eulas?: {
			[key: `${number}`]: {
				id: string;
				name: string;
				url: string;
				version?: number;
				countries?: string;
			};
		};

		kbmousegame?: 1;

		releasestateoverride?: "released";
		releasestateoverridecountries?: string;
		releasestateoverrideinverse?: 0;

		languages?: {
			[key: string]: 1;
		};

		sortas?: string;

		name_localized?: LocalizedString;

		osextended?: string;

		app_retired_publisher_request?: 1;
		app_retired_was_free?: 1;

		content_descriptors?: {
			[key: `${number}`]: number;
		};

		steam_deck_compatibility?: {
			category: number;
			steamos_compatibility: number;
			test_timestamp: number;
			tested_build_id: number;

			tests: {
				[key: `${number}`]: {
					display: number;
					token: string;
				};
			};

			steamos_tests: {
				[key: `${number}`]: {
					display: number;
					token: string;
				};
			};

			configuration: {
				supported_input: "gamepad" | "other";
				requires_manual_keyboard_invoke: 0 | 1;
				requires_non_controller_launcher_nav: 0 | 1;
				primary_player_is_controller_slot_0: 0 | 1;
				non_deck_display_glyphs: 0 | 1;
				small_text: 0 | 1;
				requires_internet_for_setup: 0 | 1;
				requires_internet_for_singleplayer: 0 | 1;
				recommended_runtime: "native" | string;
				requires_h264: 0 | 1;
				requires_voice_files?: 0 | 1;
				gamescope_frame_limiter_not_supported: 0 | 1;
				hdr_support: 0 | 1 | 2;
				proton_compat_config?: string;
			};
		};

		controller_support?: "full" | "partial";

		metacritic_name?: string;
		metacritic_score?: number;
		metacritic_url?: string;
		metacritic_fullurl?: string;

		controllertagwizard?: number;

		small_capsule?: LocalizedString;
		header_image?: LocalizedString;

		store_screenshot?: string;
		store_asset_mtime?: number;

		library_assets?: {
			library_capsule?: string;
			library_hero: string;
			library_hero_blur?: string;
			library_logo: string;
			library_header?: string;
			logo_position: LogoPosition;
		};

		library_assets_full?: {
			library_capsule: {
				image?: LocalizedString;
				image2x?: LocalizedString;
			};

			library_hero: {
				image: LocalizedString;
				image2x?: LocalizedString;
			};

			library_hero_blur?: {
				image: LocalizedString;
			};

			library_logo: {
				image: LocalizedString;
				image2x?: LocalizedString;

				logo_position: LogoPosition;
			};

			library_header?: {
				image: LocalizedString;
				image2x?: LocalizedString;
			};
		};

		associations: {
			[key: `${number}`]: {
				type: "developer" | "publisher" | "franchise";
				name: string;
			};
		};

		primary_genre: number;
		genres?: {
			[key: `${number}`]: number;
		};

		category: {
			[key: `category_${number}`]: 1;
		};

		supported_languages?: {
			[key: string]: {
				supported?: true | 1;
				full_audio?: true | 1;
				subtitles?: true;
			};
		};

		original_release_date?: number;
		steam_release_date?: number;

		community_visible_stats?: 1;
		workshop_visible?: 1;
		community_hub_visible?: 1;
		gameid: number;
		exfgls?: number;

		onlyvrsupport?: 1;

		content_descriptors_including_dlc?: {
			[key: `${number}`]: number;
		};

		store_tags?: {
			[key: `${number}`]: number;
		};

		review_score?: number;
		review_percentage?: number;
		review_score_bombs?: number;
		review_percentage_bombs?: number;

		mastersubs_granting_app?: number;
	};

	extended?: {
		cwdoverride?: string;
		installscript?: string;
		disableoverlay?: 1;
		legacykeylinkedexternally?: 1;
		hadthirdpartycdkey?: 1;
		thirdpartycdkey?: 1;
		mustownapptopurchase?: number;
		absolutemousecoordinates?: 0;
		remoteplaytogethertestingbranches?: string;
		vrheadsetstreaming?: 1;
		disable_shader_precaching?: 1;
		disableshaderreporting?: 1;
		checkpkgstate?: 1;
		developer: string;
		directx_minver?: string;
		g4w_gdf?: string;
		g4w_type?: 2;
		developer_url?: string;
		deckresolutionoverride?: "Native";
		gamedir?: string;
		homepage?: string;
		icon?: string | "";
		icon2?: string | "";
		order?: 1;
		languages?: string;
		languages_macos?: string;
		loadallbeforelaunch?: 1;
		minclientversion?: number;
		minclientversion_pw_csgo?: number;
		noservers?: 0 | 1;
		primarycache?: number;
		primarycache_macos?: number;
		serverbrowsername?: string;
		anti_cheat_support_url?: string;
		additional_dependencies?: {
			[key: `${number}`]: {
				src_os: "windows";
				dest_os: "linux";
				appid: number;
				comment: string;
			};
		};
		sourcegame?: 1;
		state?: string;
		supports64bit?: 0;
		visibleonlywhensubscribed?: 1;
		allowmicrotxnfromrestrictedcountries?: 0;
		microtxnrestrictedcountries?: string;
		vacmacmodulecache?: number;
		vacmodulecache?: number;
		vacmodulefilename?: string;
		visibleonlywheninstalled?: 1;
		validoslist?: string;
		publisher: string;
		isfreeapp?: 0 | 1;
		aliases?: string;
		gamemanualurl?: string;
		listofdlc?: string | number;
		dlcavailableonstore?: 1;
	};

	config?: {
		contenttype?: number;
		checkforupdatesbeforelaunch?: 1;
		testchange?: 2;
		launchwithoutworkshopupdates?: 1;
		installdir: string;
		replaceinstalledappid?: number;
		nativesteamcontroller?: 1;

		convertgcfs?: string | number;
		steamvrsupport?: 1;

		app_mappings?: {
			[key: `${number}`]: {
				platform: "linux";
				tool: string;
				comment?: string;
			};
		};

		launch: {
			[key: `${number}`]: {
				executable: string;
				arguments?: string | number;
				description?: string;
				workingdir?: string;
				type?: "default" | "server" | `option${number}`;
				config?: Config;
				description_loc?: {
					[key: string]: string;
				};
			};
		};

		noupdatesafterinstall?: 1;

		systemprofile?: 1;
		usemms?: 1 | "";

		vacmodulefilename?: string;
		vacmodulefilename_macos?: string;

		verifyupdates?: 0;
		usesfrenemies?: "no";

		steamcontrollerconfigfileids?: number | string;
		steamcontrollertemplateindex?: number;
		steamcontrollertouchtemplateindex?: number;
		steaminputmanifestpath?: string;

		steamcontrollertouchconfigdetails?: {
			[key: `${number}`]: {
				controller_type: string;
				enabled_branches: string;
				use_action_block: boolean;
			};
		};

		steamcontrollerconfigdetails?: {
			[key: `${number}`]: {
				controller_type: string;
				enabled_branches: string;
				use_action_block?: boolean;
			};
		};

		signaturescheckedonlaunch?: {
			[key: string]: {
				[key: `${number}`]: string;
			};
		};

		signedfiles?: {
			[key: string]: string;
		};

		"sdr-groups"?: string;
		"sdr-groups-global"?: string;

		matchmaking_uptodate?: 1;
		matchmaking_mms_appidinvitenf?: number;
		matchmaking_rate_limit?: 1;

		enabletextfiltering?: 1;
		gameoverlay_testmode?: 1;

		enable_duration_control?: 1;
		duration_control_show_interstitial?: 0;

		steam_china_only?: {
			steam_china_enable_duration_control: 1 | 0;
			steam_china_duration_control_show_interstitial?: 0;
		};

		uselaunchcommandline?: 1;
		steamconfigurator3rdpartynative?: number;
		steamdecktouchscreen?: 1 | 5;

		installscriptsignature?: string;
		installscriptoverride?: 1;

		externalarguments?:
			| {
					[key: string]: 1;
			  }
			| {
					whitelisted: {
						[key: string]: string;
					};
					blacklisted: {
						[key: string]: string;
					};
			  };
		cegpublickey?: string;
		checkguid?: string;
	};

	install?: {
		utf8_registry_strings?: 1;
		"run process"?: {
			[key: string]: {
				hasrunkey: string;
				nocleanup: 0 | 1;
				[key: `process ${number}`]: string;
				[key: `command ${number}`]: string;
			};
		};
		registry?: {
			[key: string]: {
				string?: {
					[key: string]: string | number;
				};
				dword?: {
					[key: string]:
						| number
						| {
								[key: string]: number;
						  };
				};
			};
		};
	};

	depots?: {
		[key: `${number}`]: {
			systemdefined?: 1;
			dlcappid?: number;
			config?: Config;
			depotfromapp?: number;
			sharedinstall?: 1 | 2;
			manifests?: {
				[key: string]: {
					gid: number;
					size: number;
					download: number;
				};
			};
		};

		depotdeltapatches?: 0 | 1;
		overridescddb?: 1;
		preloadonly?: 1;
		markdlcdepots?: 1 | 0;
		baselanguages?: string;
		workshopdepot?: number;
		hasdepotsindlc?: 1 | 0;

		branches: {
			[key: string]: {
				buildid: number;
				timeupdated?: number;
				description?: string;
				lcsrequired?: 1;
			};
		};

		privatebranches?: 1;
		appmanagesdlc?: 1;
	};

	ufs?: {
		sync_while_suspended?: 1;
		quota: number | "";
		maxnumfiles: number | "";
		appidredirect?: number;
		hidecloudui?: 1;
		ignoreexternalfiles?: 1;
		savefiles?: {
			[key: string]: {
				root: string;
				path: string;
				pattern: string;
				recursive?: 1;
				platforms?: {
					"1": "Windows" | "MacOS" | "Linux";
				};
			};
		};
		rootoverrides?: {
			[key: `${number}`]: {
				root: string;
				os: "Windows" | "MacOS" | "Linux";
				oscompare: "=";
				useinstead: string;
				addpath?: string;
				pathtransforms?: {
					[key: `${number}`]: {
						find: string;
						replace: string;
					};
				};
			};
		};
	};
};

export function validateSteamAppInfo(data: SteamAppInfo) {
	const validator = new Validator();
	const result = validator.validate(data, definitions.SteamAppInfo);
	if (result.valid) return true;

	console.log(data);

	throw new Error(
		`Invalid SteamAppInfo: \n- ${result.errors.map((e) => e.stack).join("\n- ")}`,
	);
}
