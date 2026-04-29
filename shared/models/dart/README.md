# cruisekit_schema (Dart)

Generated Dart models for CruiseKit's canonical Sailing & Deal schemas. **Do not hand-edit `lib/*.dart`** — they are regenerated from `/data/schema/*.schema.json` by Quicktype.

## Consuming from CruiseKit-Mobile

Add this to the mobile repo's `pubspec.yaml`:

```yaml
dependencies:
  cruisekit_schema:
    git:
      url: https://github.com/<org>/cruise-travel-agent.git
      ref: main
      path: shared/models/dart
```

Then in the mobile repo:

```bash
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
```

The `build_runner` step generates the `*.freezed.dart` and `*.g.dart` companion files needed by the generated models. Those companion files are **not** committed in this package — each consuming repo runs `build_runner` itself.

## Bumping versions

After regenerating models in the web repo (`pnpm run schema:gen`), commit, push, and update the `ref:` in the mobile repo's `pubspec.yaml` to the new commit SHA. `flutter pub upgrade cruisekit_schema` pulls the new version.
