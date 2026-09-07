import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pharmacode_app/main.dart';

void main() {
  testWidgets('PharmaCode App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: PharmaCodeApp()));
    expect(find.byType(PharmaCodeApp), findsOneWidget);
  });
}
