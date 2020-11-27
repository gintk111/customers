package repository.customer;

import model.Customer;
import model.Province;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;


public interface CustomerRepository extends PagingAndSortingRepository<Customer, Long>, CrudRepository<Customer, Long> {

    Iterable<Customer> findAllByProvince(Province province);

    Page<Customer> findAllByFirstNameContaining(String firstname, Pageable pageable);

    Iterable<Customer> findAllByOrderByIdAsc();
}
