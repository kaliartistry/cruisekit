// To parse this JSON data, do
//
//     final deal = dealFromJson(jsonString);

import 'package:freezed_annotation/freezed_annotation.dart';
import 'dart:convert';

part 'deal.freezed.dart';
part 'deal.g.dart';

Deal dealFromJson(String str) => Deal.fromJson(json.decode(str));

String dealToJson(Deal data) => json.encode(data.toJson());


///A canonical cruise deal/promotion record. Independent from Sailing — a deal may apply to
///many sailings (applicableSailingIds).
@freezed
class Deal with _$Deal {
    const factory Deal({
        String? affiliateLink,
        
        ///Optional join: Sailing.id values this deal explicitly applies to. Empty array means 'see
        ///source page for eligible sailings'.
        required List<String> applicableSailingIds,
        
        ///Last date the deal can be booked.
        required DateTime bookingEndDate,
        
        ///First date the deal can be booked.
        required DateTime bookingStartDate,
        required Confidence confidence,
        required DateTime createdAt,
        required CruiseLine cruiseLine,
        required DealType dealType,
        
        ///1–3 sentence plain-English summary of what the deal does.
        required String description,
        
        ///Required. Cruise-line URL where the deal is published.
        required String directLink,
        
        ///Plain-English exclusion list, e.g. ['Suites excluded', 'Not combinable with Casino
        ///offers'].
        required List<String> exclusions,
        
        ///Stable unique identifier. Convention: <cruiseLine>-deal-<slug>.
        required String id,
        
        ///Plain-English perk list, e.g. ['Drink package', 'WiFi', '$200 OBC'].
        required List<String> includedPerks,
        required DateTime lastVerified,
        
        ///Optional booking-flow promo code, when applicable.
        String? promoCode,
        
        ///Latest sailing departure the deal applies to.
        required DateTime sailingEndDate,
        
        ///Earliest sailing departure the deal applies to.
        required DateTime sailingStartDate,
        required SourceMetadata source,
        required String sourceUrl,
        
        ///Headline as published, e.g. 'Black Friday: Up to 60% off second guest'.
        required String title,
        required DateTime updatedAt,
    }) = _Deal;

    factory Deal.fromJson(Map<String, dynamic> json) => _$DealFromJson(json);
}

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

enum DealType {
    BUNDLED_PACKAGE,
    FREE_PERK,
    KIDS_SAIL_FREE,
    ONBOARD_CREDIT,
    PERCENT_OFF_FARE,
    PROMO_CODE,
    REDUCED_DEPOSIT,
    SECOND_GUEST_DISCOUNT
}

final dealTypeValues = EnumValues({
    "bundled-package": DealType.BUNDLED_PACKAGE,
    "free-perk": DealType.FREE_PERK,
    "kids-sail-free": DealType.KIDS_SAIL_FREE,
    "onboard-credit": DealType.ONBOARD_CREDIT,
    "percent-off-fare": DealType.PERCENT_OFF_FARE,
    "promo-code": DealType.PROMO_CODE,
    "reduced-deposit": DealType.REDUCED_DEPOSIT,
    "second-guest-discount": DealType.SECOND_GUEST_DISCOUNT
});

@freezed
class SourceMetadata with _$SourceMetadata {
    const factory SourceMetadata({
        String? advertiserName,
        String? affiliateNetwork,
        required Confidence confidence,
        required DateTime lastImported,
        required DateTime lastVerified,
        required String provider,
        required SourceType sourceType,
        required String sourceUrl,
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
