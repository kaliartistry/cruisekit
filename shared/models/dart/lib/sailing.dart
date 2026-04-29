// To parse this JSON data, do
//
//     final sailing = sailingFromJson(jsonString);

import 'package:freezed_annotation/freezed_annotation.dart';
import 'dart:convert';

part 'sailing.freezed.dart';
part 'sailing.g.dart';

Sailing sailingFromJson(String str) => Sailing.fromJson(json.decode(str));

String sailingToJson(Sailing data) => json.encode(data.toJson());


///A canonical cruise sailing record. Source of truth for both the Next.js web app
///(cruisekit.app) and the CruiseKit-Mobile Flutter app via Quicktype-generated models.
@freezed
class Sailing with _$Sailing {
    const factory Sailing({
        
        ///Optional. Tracked affiliate URL (Awin, CJ, direct partner). When present, CTAs prefer
        ///this over directLink.
        String? affiliateLink,
        required Confidence confidence,
        
        ///ISO 8601 timestamp the record was first added.
        required DateTime createdAt,
        
        ///Canonical cruise line slug.
        required CruiseLine cruiseLine,
        
        ///ISO 4217 currency code, e.g. 'USD'.
        required String currency,
        
        ///ISO date (YYYY-MM-DD) of embarkation.
        required DateTime departureDate,
        
        ///Embarkation port name, e.g. 'Cape Liberty (Bayonne, NJ)'.
        required String departurePort,
        
        ///Primary marketing region for the itinerary.
        required DestinationRegion destinationRegion,
        
        ///Required. Direct cruise-line URL to the sailing detail page. CTAs use this when
        ///affiliateLink is not yet populated.
        required String directLink,
        
        ///Stable unique identifier. Convention: <cruiseLine>-<shipSlug>-<YYYYMMDD>.
        required String id,
        
        ///Ordered list of port-of-call names (excluding sea days). Embarkation/return ports may or
        ///may not be repeated here; consumers should not assume.
        required List<String> itineraryPorts,
        
        ///ISO date the record was last manually verified against the source page.
        required DateTime lastVerified,
        
        ///Number of nights aboard.
        required int nights,
        
        ///Required field; may be empty at launch. Lat/lng for berth or port. ShipSafe SDK consumes
        ///this; missing entries should be tracked in PORT_COORDINATES_TODO.md and backfilled.
        required List<PortCoordinate> portCoordinates,
        
        ///How startingPrice is quoted. 'unspecified' is permitted only when the source page does
        ///not state a basis.
        required PriceBasis priceBasis,
        
        ///ISO date (YYYY-MM-DD) of disembarkation.
        required DateTime returnDate,
        
        ///Disembarkation port name. Equal to departurePort for round-trip sailings.
        required String returnPort,
        
        ///Itinerary or voyage name as published by the cruise line, e.g. 'Eastern Caribbean from
        ///Miami'.
        required String sailingName,
        
        ///Human-readable ship name as marketed by the cruise line.
        required String shipName,
        required SourceMetadata source,
        
        ///Canonical URL of the page used to verify this record. Should match source.sourceUrl; held
        ///at top level for query/dedup convenience.
        required String sourceUrl,
        
        ///Cruise line's lowest advertised fare under priceBasis. Null only when the source page
        ///does not publish a starting price.
        required double? startingPrice,
        
        ///True if startingPrice already includes taxes and port fees as published; false if those
        ///are quoted separately.
        required bool taxesAndFeesIncluded,
        
        ///ISO 8601 timestamp the record was last modified (any field).
        required DateTime updatedAt,
    }) = _Sailing;

    factory Sailing.fromJson(Map<String, dynamic> json) => _$SailingFromJson(json);
}


///Trust tier. Records with 'internal_do_not_publish' MUST be filtered before render.
enum Confidence {
    EDITORIAL_ONLY,
    INTERNAL_DO_NOT_PUBLISH,
    ITINERARY_VERIFIED_PRICE_CHECK_REQUIRED,
    VERIFIED_FROM_CRUISE_LINE
}

final confidenceValues = EnumValues({
    "editorial_only": Confidence.EDITORIAL_ONLY,
    "internal_do_not_publish": Confidence.INTERNAL_DO_NOT_PUBLISH,
    "itinerary_verified_price_check_required": Confidence.ITINERARY_VERIFIED_PRICE_CHECK_REQUIRED,
    "verified_from_cruise_line": Confidence.VERIFIED_FROM_CRUISE_LINE
});


///Canonical cruise line slug.
enum CruiseLine {
    CARNIVAL,
    CELEBRITY,
    DISNEY,
    HOLLAND_AMERICA,
    MSC,
    NORWEGIAN,
    PRINCESS,
    ROYAL_CARIBBEAN,
    VIRGIN_VOYAGES
}

final cruiseLineValues = EnumValues({
    "carnival": CruiseLine.CARNIVAL,
    "celebrity": CruiseLine.CELEBRITY,
    "disney": CruiseLine.DISNEY,
    "holland-america": CruiseLine.HOLLAND_AMERICA,
    "msc": CruiseLine.MSC,
    "norwegian": CruiseLine.NORWEGIAN,
    "princess": CruiseLine.PRINCESS,
    "royal-caribbean": CruiseLine.ROYAL_CARIBBEAN,
    "virgin-voyages": CruiseLine.VIRGIN_VOYAGES
});


///Primary marketing region for the itinerary.
enum DestinationRegion {
    ALASKA,
    ASIA,
    BAHAMAS,
    BERMUDA,
    CALIFORNIA_COAST,
    CARIBBEAN,
    HAWAII,
    MEDITERRANEAN,
    MEXICAN_RIVIERA,
    MEXICO,
    MIDDLE_EAST,
    NORTHERN_EUROPE,
    OTHER,
    SOUTH_PACIFIC,
    TRANSATLANTIC
}

final destinationRegionValues = EnumValues({
    "alaska": DestinationRegion.ALASKA,
    "asia": DestinationRegion.ASIA,
    "bahamas": DestinationRegion.BAHAMAS,
    "bermuda": DestinationRegion.BERMUDA,
    "california-coast": DestinationRegion.CALIFORNIA_COAST,
    "caribbean": DestinationRegion.CARIBBEAN,
    "hawaii": DestinationRegion.HAWAII,
    "mediterranean": DestinationRegion.MEDITERRANEAN,
    "mexican-riviera": DestinationRegion.MEXICAN_RIVIERA,
    "mexico": DestinationRegion.MEXICO,
    "middle-east": DestinationRegion.MIDDLE_EAST,
    "northern-europe": DestinationRegion.NORTHERN_EUROPE,
    "other": DestinationRegion.OTHER,
    "south-pacific": DestinationRegion.SOUTH_PACIFIC,
    "transatlantic": DestinationRegion.TRANSATLANTIC
});

@freezed
class PortCoordinate with _$PortCoordinate {
    const factory PortCoordinate({
        
        ///Optional berth or terminal name. ShipSafe SDK uses this when a single port has multiple
        ///terminals (e.g. Manhattan Pier 88 vs Pier 90).
        String? berth,
        required double latitude,
        required double longitude,
        
        ///Must match a value in itineraryPorts (case-sensitive) or be the embarkation/return port.
        required String portName,
        
        ///Optional citation for the coordinate (e.g. 'cruise-line port guide', 'OpenStreetMap').
        String? source,
    }) = _PortCoordinate;

    factory PortCoordinate.fromJson(Map<String, dynamic> json) => _$PortCoordinateFromJson(json);
}


///How startingPrice is quoted. 'unspecified' is permitted only when the source page does
///not state a basis.
enum PriceBasis {
    PER_CABIN,
    PER_PERSON_DOUBLE_OCCUPANCY,
    PER_PERSON_QUAD_OCCUPANCY,
    PER_PERSON_SOLO,
    UNSPECIFIED
}

final priceBasisValues = EnumValues({
    "per-cabin": PriceBasis.PER_CABIN,
    "per-person-double-occupancy": PriceBasis.PER_PERSON_DOUBLE_OCCUPANCY,
    "per-person-quad-occupancy": PriceBasis.PER_PERSON_QUAD_OCCUPANCY,
    "per-person-solo": PriceBasis.PER_PERSON_SOLO,
    "unspecified": PriceBasis.UNSPECIFIED
});

@freezed
class SourceMetadata with _$SourceMetadata {
    const factory SourceMetadata({
        String? advertiserName,
        
        ///Awin, CJ, Impact, etc. Null when sourceType is not 'affiliate-feed'.
        String? affiliateNetwork,
        required Confidence confidence,
        required DateTime lastImported,
        required DateTime lastVerified,
        
        ///Origin of the data, e.g. 'royalcaribbean.com', 'CJ:Norwegian', 'Awin:GoToSea'.
        required String provider,
        required SourceType sourceType,
        required String sourceUrl,
        
        ///Free-text reminder of source-specific ToS constraints (e.g. 'CJ feed: 24h cache TTL').
        String? termsNotes,
    }) = _SourceMetadata;

    factory SourceMetadata.fromJson(Map<String, dynamic> json) => _$SourceMetadataFromJson(json);
}

enum SourceType {
    AFFILIATE_FEED,
    CRUISE_LINE_WEBSITE,
    MANUAL_EDITORIAL,
    PRESS_RELEASE
}

final sourceTypeValues = EnumValues({
    "affiliate-feed": SourceType.AFFILIATE_FEED,
    "cruise-line-website": SourceType.CRUISE_LINE_WEBSITE,
    "manual-editorial": SourceType.MANUAL_EDITORIAL,
    "press-release": SourceType.PRESS_RELEASE
});

class EnumValues<T> {
    Map<String, T> map;
    late Map<T, String> reverseMap;

    EnumValues(this.map);

    Map<T, String> get reverse {
            reverseMap = map.map((k, v) => MapEntry(v, k));
            return reverseMap;
    }
}
