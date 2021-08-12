import { User } from '../../user/user.entity';

export default class TestUtil {
  static giveAMeAValidUser(): User {
    const user = new User();
    user.id = '1';
    user.name = 'Valid User';
    user.email = 'valid@email.com';

    return user;
  }
}