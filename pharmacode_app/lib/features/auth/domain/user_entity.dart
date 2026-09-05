/// Clean Domain Entity representing a PharmaCode student user
class UserEntity {
  final String uid;
  final String email;
  final String displayName;
  final String photoUrl;
  final String avatarKey;
  final String college;
  final String batch;
  final int semester;
  final bool isEmailVerified;

  const UserEntity({
    required this.uid,
    required this.email,
    required this.displayName,
    this.photoUrl = '',
    this.avatarKey = 'mascot',
    this.college = '',
    this.batch = 'Batch 2024–28',
    this.semester = 1,
    this.isEmailVerified = false,
  });

  UserEntity copyWith({
    String? uid,
    String? email,
    String? displayName,
    String? photoUrl,
    String? avatarKey,
    String? college,
    String? batch,
    int? semester,
    bool? isEmailVerified,
  }) {
    return UserEntity(
      uid: uid ?? this.uid,
      email: email ?? this.email,
      displayName: displayName ?? this.displayName,
      photoUrl: photoUrl ?? this.photoUrl,
      avatarKey: avatarKey ?? this.avatarKey,
      college: college ?? this.college,
      batch: batch ?? this.batch,
      semester: semester ?? this.semester,
      isEmailVerified: isEmailVerified ?? this.isEmailVerified,
    );
  }
}
